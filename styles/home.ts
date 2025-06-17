import { StyleSheet } from 'react-native';

export const homeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingBottom: 90,
    },
    header: {
      padding: 20,
      paddingTop: 60,
    },
    greeting: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardIcon: {
      marginBottom: 12,
    },
    cardValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    cardLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    balanceCard: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      marginBottom: 24,
    },
    balanceValue: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    balanceLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    reminderSection: {
      marginBottom: 24,
    },
    addReminderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    addReminderText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 12,
    },
    reminderItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reminderTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    reminderContent: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    reminderTime: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 20,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    buttonSecondary: {
      backgroundColor: colors.background,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    timeInput: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      marginVertical: 10,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 10,
    },
    timeInputText: {
      marginLeft: 10,
      color: colors.text,
    },
    repeatInput: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      marginVertical: 10,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 10,
    },
    repeatInputText: {
      marginLeft: 10,
      color: colors.text,
    },
    repeatOptions: {
      marginVertical: 10,
    },
    repeatOption: {
      padding: 15,
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor: colors.backgroundSecondary,
    },
    repeatOptionActive: {
      backgroundColor: colors.primary,
    },
    repeatOptionText: {
      color: colors.text,
    },
    repeatOptionTextActive: {
      color: colors.textInverse,
    },
    daySelection: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    dayButton: {
      width: '14%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      margin: 2,
      backgroundColor: colors.backgroundSecondary,
    },
    dayButtonActive: {
      backgroundColor: colors.primary,
    },
    dayButtonText: {
      color: colors.text,
    },
    dayButtonTextActive: {
      color: colors.textInverse,
    },
  });
