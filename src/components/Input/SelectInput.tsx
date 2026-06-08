import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseInput } from './BaseInput';
import { InputProps } from './types';
import { styles, COLORS } from './styles';

export const SelectInput: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  value,
  onValueChange,
  options = [],
  placeholder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectOption = (optValue: any) => {
    if (onValueChange) {
      onValueChange(optValue);
    }
    setModalVisible(false);
  };

  // Find currently selected label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : '';

  const rightElement = (
    <Ionicons
      name="chevron-down-outline"
      size={18}
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
        onPressContainer={handleOpenModal}
      >
        <Text style={[styles.readOnlyText, !displayLabel && styles.placeholderText]}>
          {displayLabel || placeholder || 'Seleccionar opción'}
        </Text>
      </BaseInput>

      {/* Modal-based Bottom Sheet */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable style={styles.bottomSheetContainer}>
            {/* Bottom Sheet Header */}
            <View style={styles.bottomSheetHeader}>
              <View style={styles.dragHandle} />
              <Text style={styles.bottomSheetTitle}>{label || 'Seleccionar opción'}</Text>
            </View>

            {/* List of Options */}
            <ScrollView bounces={false}>
              {options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={`${option.value}-${index}`}
                    style={styles.optionItem}
                    onPress={() => handleSelectOption(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionItemText,
                        isSelected && styles.optionItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={COLORS.borderFocus} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
