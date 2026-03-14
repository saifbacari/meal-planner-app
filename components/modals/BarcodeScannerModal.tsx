import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, ColorPalette, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const C = Colors.dark;

type Props = {
  visible: boolean;
  onClose: () => void;
  onProductFound: (name: string) => void;
};

type ScanState = 'scanning' | 'loading' | 'found' | 'error';

export function BarcodeScannerModal({ visible, onClose, onProductFound }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [productName, setProductName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setScanState('scanning');
      setProductName('');
      setErrorMsg('');
    }
  }, [visible]);

  const handleBarcode = async ({ data }: { data: string }) => {
    if (scanState !== 'scanning') return;
    setScanState('loading');

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const json = await res.json();

      if (json.status === 1 && json.product) {
        const name =
          json.product.product_name_fr ||
          json.product.product_name ||
          json.product.generic_name_fr ||
          json.product.generic_name;

        if (name) {
          setProductName(name);
          setScanState('found');
        } else {
          setErrorMsg('Produit trouvé mais sans nom.');
          setScanState('error');
        }
      } else {
        setErrorMsg('Produit non reconnu dans la base.');
        setScanState('error');
      }
    } catch {
      setErrorMsg('Erreur réseau. Réessayez.');
      setScanState('error');
    }
  };

  const handleConfirm = () => {
    onProductFound(productName);
    onClose();
  };

  const handleRetry = () => {
    setScanState('scanning');
    setProductName('');
    setErrorMsg('');
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Scanner un produit</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color={C.text} />
          </TouchableOpacity>
        </View>

        {/* Camera or permission */}
        {!permission ? (
          <View style={styles.center}>
            <ActivityIndicator color={ColorPalette.primary} size="large" />
          </View>
        ) : !permission.granted ? (
          <View style={styles.center}>
            <MaterialIcons name="camera-alt" size={48} color={C.textMuted} />
            <Text style={styles.permText}>Accès à la caméra requis</Text>
            <TouchableOpacity style={styles.btn} onPress={requestPermission}>
              <Text style={styles.btnText}>Autoriser</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
              onBarcodeScanned={scanState === 'scanning' ? handleBarcode : undefined}
            />

            {/* Viewfinder overlay */}
            <View style={styles.overlay}>
              <View style={styles.viewfinder} />
              <Text style={styles.hint}>
                {scanState === 'scanning' ? 'Pointez vers le code-barres' : ''}
              </Text>
            </View>

            {/* Result overlay */}
            {scanState === 'loading' && (
              <View style={styles.resultOverlay}>
                <ActivityIndicator color={ColorPalette.primary} size="large" />
                <Text style={styles.resultText}>Recherche du produit...</Text>
              </View>
            )}

            {scanState === 'found' && (
              <View style={styles.resultOverlay}>
                <MaterialIcons name="check-circle" size={48} color={ColorPalette.primary} />
                <Text style={styles.resultText}>{productName}</Text>
                <View style={styles.resultActions}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={handleRetry}>
                    <Text style={styles.btnSecondaryText}>Rescanner</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
                    <Text style={styles.btnText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {scanState === 'error' && (
              <View style={styles.resultOverlay}>
                <MaterialIcons name="error-outline" size={48} color={ColorPalette.error} />
                <Text style={[styles.resultText, { color: ColorPalette.error }]}>{errorMsg}</Text>
                <TouchableOpacity style={styles.btn} onPress={handleRetry}>
                  <Text style={styles.btnText}>Réessayer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  closeBtn: {
    padding: Spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  permText: {
    fontSize: FontSize.base,
    color: C.textMuted,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: 240,
    height: 160,
    borderWidth: 2,
    borderColor: ColorPalette.primary,
    borderRadius: Radius.md,
    backgroundColor: 'transparent',
  },
  hint: {
    marginTop: Spacing.lg,
    fontSize: FontSize.sm,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 34, 22, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  resultText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: C.text,
    textAlign: 'center',
  },
  resultActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  btn: {
    backgroundColor: ColorPalette.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  btnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#000',
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  btnSecondaryText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: C.text,
  },
});
