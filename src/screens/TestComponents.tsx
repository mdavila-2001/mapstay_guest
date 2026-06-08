import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CustomModal } from '../components/CustomModal';

const StarIcon = ({ color = '#fff' }: { color?: string }) => (
    <View style={[styles.starIcon, { backgroundColor: color }]} />
);

export default function TestComponents() {
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
});