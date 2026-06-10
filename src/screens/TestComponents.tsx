import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CustomModal } from '../components/CustomModal';
import { CustomTable, ColumnConfig } from '../components/CustomTable';
import { useNotification } from '../components/NotificationProvider';

interface BookingData {
    id: string;
    guestName: string;
    room: string;
    checkIn: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    total: number;
}

interface PropertyLog {
    id: string;
    propertyName: string;
    location: string;
    hostName: string;
    rating: number;
    occupancyRate: string;
    revenue: string;
}

const BOOKINGS_DATA: BookingData[] = [
    { id: '1', guestName: 'Alejandro M.', room: 'Suite Deluxe 302', checkIn: '08/06/2026', status: 'confirmed', total: 240 },
    { id: '2', guestName: 'Mariana S.', room: 'Standard 104', checkIn: '09/06/2026', status: 'pending', total: 110 },
    { id: '3', guestName: 'Carlos T.', room: 'Cabaña Forest', checkIn: '12/06/2026', status: 'cancelled', total: 320 },
];

const PROPERTY_LOGS: PropertyLog[] = [
    { id: '1', propertyName: 'MapStay Central Loft', location: 'La Paz, Centro', hostName: 'Ramiro P.', rating: 4.8, occupancyRate: '88%', revenue: '$1,200' },
    { id: '2', propertyName: 'MapStay Lake Cabin', location: 'Copacabana', hostName: 'Elena V.', rating: 4.9, occupancyRate: '95%', revenue: '$2,450' },
    { id: '3', propertyName: 'MapStay Cozy Apt', location: 'Santa Cruz', hostName: 'Jorge G.', rating: 4.6, occupancyRate: '75%', revenue: '$980' },
];

const StarIcon = ({ color = '#fff' }: { color?: string }) => (
    <View style={[styles.starIcon, { backgroundColor: color }]} />
);

export default function TestComponents() {
    const { showToast, showAlert } = useNotification();
  // Input states
    const [textVal, setTextVal] = useState('');
    const [numberVal, setNumberVal] = useState('');
    const [passwordVal, setPasswordVal] = useState('');
    const [dateVal, setDateVal] = useState<Date | undefined>(undefined);
    const [selectVal, setSelectVal] = useState('');
    const [errorInputVal, setErrorInputVal] = useState('Invalid value format');

    // Modal states
    const [dialogVisible, setDialogVisible] = useState(false);
    const [sheetVisible, setSheetVisible] = useState(false);

    // Table states & handlers
    const [pressedRowText, setPressedRowText] = useState<string>('');
    const handleRowPress = (item: BookingData) => {
      setPressedRowText(`Fila presionada: ${item.guestName} - ${item.room} ($${item.total})`);
    };

    // Columns config for bookings (flex based)
    const bookingColumns: ColumnConfig<BookingData>[] = [
      {
        key: 'guestName',
        title: 'Huésped',
        flex: 1.8,
        align: 'left',
      },
      {
        key: 'room',
        title: 'Habitación',
        flex: 2.2,
        align: 'left',
      },
      {
        key: 'status',
        title: 'Estado',
        flex: 1.5,
        align: 'center',
        render: (item) => {
          let badgeStyle = styles.badgePending;
          let badgeText = 'Pendiente';
          if (item.status === 'confirmed') {
            badgeStyle = styles.badgeConfirmed;
            badgeText = 'Confirmada';
          } else if (item.status === 'cancelled') {
            badgeStyle = styles.badgeCancelled;
            badgeText = 'Cancelada';
          }
          return (
            <View style={[styles.badgeBase, badgeStyle]}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          );
        },
      },
      {
        key: 'total',
        title: 'Total',
        flex: 1.2,
        align: 'right',
        render: (item) => (
          <Text style={styles.priceText}>
            ${item.total.toFixed(2)}
          </Text>
        ),
      },
    ];

    // Columns config for property stats (horizontal scroll based with fixed widths)
    const propertyColumns: ColumnConfig<PropertyLog>[] = [
      {
        key: 'propertyName',
        title: 'Propiedad',
        width: 160,
        align: 'left',
      },
      {
        key: 'location',
        title: 'Ubicación',
        width: 120,
        align: 'left',
      },
      {
        key: 'hostName',
        title: 'Anfitrión',
        width: 100,
        align: 'left',
      },
      {
        key: 'rating',
        title: 'Rating',
        width: 80,
        align: 'center',
        render: (item) => (
          <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
        ),
      },
      {
        key: 'occupancyRate',
        title: 'Ocupación',
        width: 90,
        align: 'center',
      },
      {
        key: 'revenue',
        title: 'Ingresos',
        width: 100,
        align: 'right',
        render: (item) => (
          <Text style={styles.revenueText}>{item.revenue}</Text>
        ),
      },
    ];

    const countryOptions = [
        { label: 'Bolivia', value: 'bo' },
        { label: 'Argentina', value: 'ar' },
        { label: 'Chile', value: 'cl' },
        { label: 'Perú', value: 'pe' },
        { label: 'Colombia', value: 'co' },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="light" />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>MapStay Design System</Text>
                        <Text style={styles.subtitle}>Component Showcase (Modo Oscuro)</Text>
                    </View>

                    {/* SECTION: MODALS SHOWCASE */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>1. Ventanas Modulares (CustomModal)</Text>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Diálogo Centrado (Animación: 'fade')</Text>
                            <Button
                                text="Ver Confirmación de Reserva"
                                variant="primary"
                                onPress={() => setDialogVisible(true)}
                            />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Bottom Sheet (Animación: 'slide')</Text>
                            <Button
                                text="Ver Filtros de Búsqueda"
                                variant="secondary"
                                onPress={() => setSheetVisible(true)}
                            />
                        </View>
                    </View>

                    {/* SECTION: INPUTS SYSTEM SHOWCASE */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>2. Campos de Entrada (Inputs SOLID)</Text>

                        {/* A. TEXT INPUT */}
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Text Input (Foco & Outline Animados)</Text>
                            <Input
                                variant="text"
                                label="Nombre Completo"
                                placeholder="Ingresa tu nombre..."
                                iconName="person-outline"
                                value={textVal}
                                onValueChange={setTextVal}
                            />
                            <Text style={styles.valueFeedback}>Valor: {textVal || 'Vacío'}</Text>
                        </View>

                        {/* B. NUMBER INPUT */}
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Number Input (Teclado Numérico)</Text>
                            <Input
                                variant="number"
                                label="Teléfono de Contacto"
                                placeholder="Ej. +591 7000000"
                                iconName="call-outline"
                                value={numberVal}
                                onValueChange={setNumberVal}
                            />
                            <Text style={styles.valueFeedback}>Valor: {numberVal || 'Vacío'}</Text>
                        </View>

                        {/* C. PASSWORD INPUT */}
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Password Input (Secure Toggle)</Text>
                            <Input
                                variant="password"
                                label="Contraseña"
                                placeholder="Crea una contraseña segura"
                                iconName="lock-closed-outline"
                                value={passwordVal}
                                onValueChange={setPasswordVal}
                            />
                            <Text style={styles.valueFeedback}>Valor: {passwordVal ? '••••••••' : 'Vacío'}</Text>
                        </View>

                        {/* D. DATE INPUT */}
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Date Input (DatePicker Nativo)</Text>
                            <Input
                                variant="date"
                                label="Fecha de Nacimiento"
                                placeholder="Seleccionar fecha"
                                iconName="calendar-outline"
                                value={dateVal}
                                onValueChange={setDateVal}
                            />
                            <Text style={styles.valueFeedback}>
                                Valor: {dateVal ? dateVal.toLocaleDateString() : 'Ninguna'}
                            </Text>
                        </View>

                        {/* E. SELECT INPUT */}
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Select Input (Custom Bottom Sheet)</Text>
                            <Input
                                variant="select"
                                label="País de Residencia"
                                placeholder="Elige tu país"
                                iconName="globe-outline"
                                options={countryOptions}
                                value={selectVal}
                                onValueChange={setSelectVal}
                            />
                            <Text style={styles.valueFeedback}>Valor: {selectVal || 'Ninguno'}</Text>
                        </View>

                        {/* F. ERROR STATE */}
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Input con Estado de Error</Text>
                            <Input
                                variant="text"
                                label="Correo Electrónico"
                                placeholder="Ingresa un correo inválido"
                                iconName="mail-outline"
                                error={errorInputVal}
                                value={errorInputVal ? 'john.doe@' : ''}
                                onValueChange={(txt) => {
                                    if (txt.includes('@') && txt.includes('.')) {
                                        setErrorInputVal('');
                                    } else {
                                        setErrorInputVal('Formato de correo no válido');
                                    }
                                }}
                            />
                        </View>
                    </View>

                    {/* SECTION: BUTTON SHOWCASE */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>3. Variantes de Botón (Altura 48px)</Text>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Primary (Sea Green/Teal)</Text>
                            <Button text="Primary Button" variant="primary" />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Secondary (Navy/Light Blue)</Text>
                            <Button text="Secondary Button" variant="secondary" />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Outline (Borde Outline/Off-white)</Text>
                            <Button text="Outline Button" variant="outline" />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Text (Sin fondo/Teal Text)</Text>
                            <Button text="Text Button" variant="text" />
                        </View>
                    </View>

                    {/* SECTION: BUTTON STATES */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>4. Estados del Botón (Loading / Disabled)</Text>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Loading State (Primary)</Text>
                            <Button text="Save Changes" variant="primary" loading={true} />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Loading State (Secondary)</Text>
                            <Button text="Loading Secondary" variant="secondary" loading={true} />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Disabled State (Primary)</Text>
                            <Button text="Unavailable" variant="primary" disabled={true} />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Disabled State (Outline)</Text>
                            <Button text="Blocked Option" variant="outline" disabled={true} />
                        </View>
                    </View>

                    {/* SECTION: BUTTON ROUNDNESS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>5. Radios de Curvatura del Botón (Roundness)</Text>

                        <View style={styles.row}>
                            <View style={styles.flexItem}>
                                <Text style={styles.itemLabel}>'sm' (4px)</Text>
                                <Button text="Round sm" variant="primary" roundness="sm" />
                            </View>
                            <View style={styles.flexItem}>
                                <Text style={styles.itemLabel}>'md' (12px - Default)</Text>
                                <Button text="Round md" variant="primary" roundness="md" />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flexItem}>
                                <Text style={styles.itemLabel}>'lg' (16px)</Text>
                                <Button text="Round lg" variant="primary" roundness="lg" />
                            </View>
                            <View style={styles.flexItem}>
                                <Text style={styles.itemLabel}>'full' (Píldora)</Text>
                                <Button text="Round full" variant="primary" roundness="full" />
                            </View>
                        </View>
                    </View>

                    {/* SECTION: BUTTON SIZES */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>6. Tamaños de Botón & Iconos</Text>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Size: 'md' (Altura 48px, label-md)</Text>
                            <Button text="Medium Button" size="md" variant="secondary" />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Size: 'sm' (Altura 38px, label-sm)</Text>
                            <Button text="Small Button" size="sm" variant="secondary" />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Con Icono (Primary)</Text>
                            <Button
                                text="Explorar Reservas"
                                variant="primary"
                                icon={<StarIcon color="#003734" />}
                            />
                        </View>

                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Con Icono (Outline)</Text>
                            <Button
                                text="Añadir a Favoritos"
                                variant="outline"
                                icon={<StarIcon color="#dae2fd" />}
                            />
                        </View>
                    </View>

                    {/* SECTION: CUSTOMTABLE SHOWCASE */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>7. Tabla Modular (CustomTable - Flex Layout)</Text>
                        
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Tabla de Reservas (Zebra Striped & Interactive Row Press)</Text>
                            <CustomTable
                                data={BOOKINGS_DATA}
                                columns={bookingColumns}
                                keyExtractor={(item) => item.id}
                                zebraStriped={true}
                                onRowPress={handleRowPress}
                            />
                            {pressedRowText ? (
                                <Text style={styles.pressedTextFeedback}>{pressedRowText}</Text>
                            ) : null}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>8. Tabla Responsiva (CustomTable - Horizontal Scroll)</Text>
                        
                        <View style={styles.showcaseItem}>
                            <Text style={styles.itemLabel}>Estadísticas de Propiedades (Anchos Fijos, Scrollable)</Text>
                            <CustomTable
                                data={PROPERTY_LOGS}
                                columns={propertyColumns}
                                keyExtractor={(item) => item.id}
                                horizontalScroll={true}
                                zebraStriped={false}
                            />
                        </View>
                    </View>

                    {/* SECTION: GLOBAL NOTIFICATIONS & ALERTS SHOWCASE */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>9. Notificaciones y Alertas Globales (`useNotification`)</Text>

                        {/* A. TOASTS */}
                        <Text style={styles.itemLabel}>Notificaciones Efímeras (Toasts)</Text>
                        <View style={styles.row}>
                            <Button
                                text="Success Toast"
                                variant="primary"
                                style={styles.flexItem}
                                onPress={() => showToast({
                                    message: '¡Reserva confirmada con éxito!',
                                    type: 'success',
                                })}
                            />
                            <Button
                                text="Info Toast"
                                variant="secondary"
                                style={styles.flexItem}
                                onPress={() => showToast({
                                    message: 'Nueva habitación disponible en Copacabana.',
                                    type: 'info',
                                    duration: 4000,
                                })}
                            />
                        </View>
                        <View style={[styles.row, { marginTop: 8 }]}>
                            <Button
                                text="Error Toast"
                                variant="outline"
                                style={styles.flexItem}
                                onPress={() => showToast({
                                    message: 'Error crítico al procesar pago: Operación abortada (☠️).',
                                    type: 'error',
                                })}
                            />
                            <Button
                                text="Warning Toast"
                                variant="secondary"
                                style={styles.flexItem}
                                onPress={() => showToast({
                                    message: 'Peligro: El token de acceso expira en 5 minutos.',
                                    type: 'warning',
                                })}
                            />
                        </View>

                        {/* B. CONFIRMATION ALERTS */}
                        <Text style={[styles.itemLabel, { marginTop: 16 }]}>Diálogos de Confirmación Críticos (Alertas)</Text>
                        <View style={styles.row}>
                            <Button
                                text="Info Alert"
                                variant="secondary"
                                style={styles.flexItem}
                                onPress={() => showAlert({
                                    title: 'Información de Cuenta',
                                    message: 'Los cambios de perfil se aplican inmediatamente en toda la red de MapStay.',
                                    type: 'info',
                                    confirmText: 'Entendido',
                                    onConfirm: () => showToast({ message: 'Alerta leída.', type: 'info' }),
                                })}
                            />
                            <Button
                                text="Confirm Alert"
                                variant="outline"
                                style={styles.flexItem}
                                onPress={() => showAlert({
                                    title: '¿Eliminar Reserva?',
                                    message: 'Esta acción cancelará la reserva del Huésped Alejandro M. permanentemente. ¿Deseas continuar?',
                                    type: 'error',
                                    confirmText: 'Eliminar',
                                    cancelText: 'Volver',
                                    onConfirm: () => showToast({
                                        message: 'La reserva ha sido cancelada exitosamente.',
                                        type: 'success',
                                    }),
                                    onCancel: () => showToast({
                                        message: 'Cancelación abortada.',
                                        type: 'info',
                                    }),
                                })}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* DIALOG VARIANT SHOWCASE (FADE) */}
            <CustomModal
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Confirmación de Reserva"
                type="fade"
            >
                <Text style={styles.modalText}>
                    ¿Estás seguro de que deseas confirmar tu reserva en MapStay Guest House? Esta acción no se puede deshacer.
                </Text>
                <View style={styles.modalActionsRow}>
                    <Button
                        text="Cancelar"
                        variant="outline"
                        style={styles.modalActionBtn}
                        onPress={() => setDialogVisible(false)}
                    />
                    <Button
                        text="Confirmar"
                        variant="primary"
                        style={styles.modalActionBtn}
                        onPress={() => setDialogVisible(false)}
                    />
                </View>
            </CustomModal>

            {/* BOTTOM SHEET VARIANT SHOWCASE (SLIDE) */}
            <CustomModal
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                title="Filtros de Búsqueda"
                type="slide"
            >
                <Text style={styles.modalText}>
                    Personaliza tu búsqueda en MapStay para encontrar el hospedaje ideal.
                </Text>
                <Input
                    variant="text"
                    label="Destino"
                    placeholder="Ej. La Paz, Bolivia"
                    iconName="pin-outline"
                />
                <Input
                    variant="number"
                    label="Presupuesto Máximo ($)"
                    placeholder="Ej. 150"
                    iconName="cash-outline"
                />
                <Button
                    text="Aplicar Filtros"
                    variant="primary"
                    style={styles.applyFilterBtn}
                    onPress={() => setSheetVisible(false)}
                />
            </CustomModal>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F1F5F9',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 4,
    },
    section: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#38BDF8',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        paddingBottom: 8,
    },
    showcaseItem: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    flexItem: {
        flex: 0.48,
    },
    itemLabel: {
        fontSize: 12,
        color: '#38BDF8',
        marginBottom: 8,
        fontWeight: '500',
    },
    valueFeedback: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
        fontStyle: 'italic',
    },
    starIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    // Modal text & layout styles
    modalText: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#dae2fd',
        lineHeight: 20,
        marginBottom: 18,
    },
    modalActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    modalActionBtn: {
        flex: 0.48,
    },
    applyFilterBtn: {
        marginTop: 8,
    },
    badgeBase: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeConfirmed: {
        backgroundColor: '#003734',
        borderWidth: 1,
        borderColor: '#59dad1',
    },
    badgePending: {
        backgroundColor: '#222a3d',
        borderWidth: 1,
        borderColor: '#8e9198',
    },
    badgeCancelled: {
        backgroundColor: '#3b1212',
        borderWidth: 1,
        borderColor: '#f87171',
    },
    badgeText: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '600',
        color: '#dae2fd',
    },
    priceText: {
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: '700',
        color: '#59dad1',
    },
    ratingText: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: '#dae2fd',
    },
    revenueText: {
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: '600',
        color: '#59dad1',
    },
    pressedTextFeedback: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: '#38BDF8',
        marginTop: 8,
        fontStyle: 'italic',
    },
});