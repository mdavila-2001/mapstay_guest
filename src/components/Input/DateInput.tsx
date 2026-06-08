import React, { useState } from 'react';
import { View, Text, Platform, Modal, StyleSheet, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { BaseInput } from './BaseInput';
import { InputProps } from './types';
import { styles, COLORS } from './styles';

export const DateInput: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  value,
  onValueChange,
  placeholder,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value instanceof Date ? value : new Date());

  const handleOpenPicker = () => {
    if (value instanceof Date) {
      setTempDate(value);
    }
    setShowPicker(true);
  };

  const handleClosePicker = () => {
    setShowPicker(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) {
        if (onValueChange) {
          onValueChange(selectedDate);
        }
      }
    } else if (selectedDate) {
      setTempDate(selectedDate);
    } else {
      setShowPicker(false);
    }
  };

  const handleIOSConfirm = () => {
    if (onValueChange) {
      onValueChange(tempDate);
    }
    setShowPicker(false);
  };

  const formatDate = (date: any) => {
    if (!date || !(date instanceof Date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dateString = value instanceof Date ? formatDate(value) : '';

  const rightElement = (
    <Ionicons
      name="calendar-outline"
      size={20}
      color={error ? COLORS.errorColor : COLORS.borderDefault}
    />
  );

  return (
    <>
      <BaseInput
        label={label}
        error={error}
        iconName={iconName}
        rightElement={rightElement}
        onPressContainer={handleOpenPicker}
      >
        <Text style={[styles.readOnlyText, !dateString && styles.placeholderText]}>
          {dateString || placeholder || 'Seleccionar fecha'}
        </Text>
      </BaseInput>

      {/* Cross-Platform Native Date Picker */}
      {showPicker && (
        Platform.OS === 'android' ? (
          <DateTimePicker
            value={value instanceof Date ? value : new Date()}
            mode="date"
            display="default"
            onValueChange={handleDateChange}
            onDismiss={handleClosePicker}
          />
        ) : (
          /* iOS Dialog Wrapper Modal */
          <Modal
            transparent
            animationType="slide"
            visible={showPicker}
            onRequestClose={handleClosePicker}
          >
            <Pressable style={styles.modalOverlay} onPress={handleClosePicker}>
              <Pressable style={iosStyles.iosPickerContainer}>
                {/* Actions Bar */}
                <View style={iosStyles.actionsBar}>
                  <Pressable onPress={handleClosePicker} style={iosStyles.actionBtn}>
                    <Text style={iosStyles.cancelText}>Cancelar</Text>
                  </Pressable>
                  <Text style={styles.bottomSheetTitle}>Fecha</Text>
                  <Pressable onPress={handleIOSConfirm} style={iosStyles.actionBtn}>
                    <Text style={iosStyles.confirmText}>Confirmar</Text>
                  </Pressable>
                </View>
                {/* Native Picker */}
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  textColor="#fff"
                  themeVariant="dark"
                  onValueChange={handleDateChange}
                  onDismiss={handleClosePicker}
                />
              </Pressable>
            </Pressable>
          </Modal>
        )
      )}
    </>
  );
};

const iosStyles = StyleSheet.create({
  iosPickerContainer: {
    backgroundColor: COLORS.bottomSheetBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    width: '100%',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomSheetBorder,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: COLORS.errorColor,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  confirmText: {
    color: COLORS.borderFocus,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});
