import { StyleSheet } from 'react-native';
import { TYPOGRAPHY } from '../../core/theme/theme';

export const COLORS = {
  containerBg: '#171f33',
  textColor: '#dae2fd',
  placeholderColor: '#c4c6cf',
  borderDefault: '#8e9198',
  borderFocus: '#59dad1',
  errorColor: '#ffb4ab',
  modalOverlayBg: 'rgba(15, 23, 42, 0.75)',
  bottomSheetBg: '#111827',
  bottomSheetBorder: '#1f2937',
};

export const styles = StyleSheet.create({

  fieldContainer: {
    width: '100%',
    marginBottom: 16,
  },

  label: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '500',
    color: COLORS.placeholderColor,
    marginBottom: 6,
    lineHeight: 14,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.containerBg,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: 14,
  },

  wrapperFocused: {
    borderWidth: 2,
    borderColor: COLORS.borderFocus,
  },

  wrapperError: {
    borderWidth: 1,
    borderColor: COLORS.errorColor,
  },

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

  inputControl: {
    flex: 1,
    height: '100%',
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textColor,
    fontWeight: '400',
    padding: 0,
  },

  readOnlyText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textColor,
    flex: 1,
    textAlignVertical: 'center',
  },

  placeholderText: {
    color: COLORS.placeholderColor,
  },

  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },

  errorText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.errorColor,
    marginTop: 4,
    lineHeight: 14,
  },

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
    paddingBottom: 34,
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
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.sizes.md,
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
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textColor,
  },

  optionItemTextSelected: {
    color: COLORS.borderFocus,
    fontWeight: '600',
  },
});

