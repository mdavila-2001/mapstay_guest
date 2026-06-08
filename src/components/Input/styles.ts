import { StyleSheet } from 'react-native';

export const COLORS = {
  containerBg: '#171f33',       // surface-container
  textColor: '#dae2fd',         // on-surface
  placeholderColor: '#c4c6cf',  // on-surface-variant
  borderDefault: '#8e9198',     // outline
  borderFocus: '#59dad1',       // secondary / Sea Green
  errorColor: '#ffb4ab',        // error
  modalOverlayBg: 'rgba(15, 23, 42, 0.75)', // Elegant overlay for dropdowns
  bottomSheetBg: '#111827',     // Dark slate for sheet background
  bottomSheetBorder: '#1f2937', // Border for sheet options
};

export const styles = StyleSheet.create({
  // Main container (outer wrapper)
  fieldContainer: {
    width: '100%',
    marginBottom: 16,
  },
  
  // Label typography and layout (label-sm)
  label: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.placeholderColor,
    marginBottom: 6,
    lineHeight: 14,
  },
  
  // Input container box (fixed height, background, border radius, outline)
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.containerBg,
    borderRadius: 12, // rounded.md
    height: 50,      // Altura fija entre 48px y 54px
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: 14,
  },

  // Focus border state
  wrapperFocused: {
    borderWidth: 2,
    borderColor: COLORS.borderFocus,
  },

  // Error border state
  wrapperError: {
    borderWidth: 1,
    borderColor: COLORS.errorColor,
  },

  // Icon positioning
  leftIconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightIconWrapper: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Input control (body-md typography)
  inputControl: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.textColor,
    fontWeight: '400',
    padding: 0, // Reset default Android paddings
  },

  // Read-only text style for Picker inputs (Date, Select)
  readOnlyText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.textColor,
    flex: 1,
    textAlignVertical: 'center',
  },

  placeholderText: {
    color: COLORS.placeholderColor,
  },

  // Inner row layout to fill the Pressable container completely
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },

  // Error typography and layout
  errorText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: COLORS.errorColor,
    marginTop: 4,
    lineHeight: 14,
  },

  // Modal / Bottom Sheet layout styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlayBg,
    justifyContent: 'flex-end',
  },

  bottomSheetContainer: {
    backgroundColor: COLORS.bottomSheetBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 34, // Safe area padding for bottom
  },

  bottomSheetHeader: {
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomSheetBorder,
  },

  dragHandle: {
    width: 38,
    height: 4,
    backgroundColor: COLORS.borderDefault,
    borderRadius: 2,
    marginBottom: 8,
  },

  bottomSheetTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textColor,
  },

  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomSheetBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionItemText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.textColor,
  },

  optionItemTextSelected: {
    color: COLORS.borderFocus,
    fontWeight: '600',
  },
});
