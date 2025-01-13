export const validateFields = (amount, note) => {
    const errors = {};
  
    const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/; 
    if (!amount) {
      errors.amount = "שדה חובה";
    } else if (!amountRegex.test(amount)) {
      errors.amount = "הכנס מספר חוקי (לדוגמה: 50 או 50.75)";
    } else if (parseFloat(amount) > Number.MAX_SAFE_INTEGER) {
      errors.amount = "המספר גדול מדי";
    }
    if (!note) {
      errors.note = "שדה חובה";
    } else if (note.length > 50) {
      errors.note = "לא ניתן להכניס יותר מ-50 תווים";
    }
  
    return errors;
};
  