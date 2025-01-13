const checkTheSafeNumber = (str) => {
  try {
    const num = parseFloat(str.trim());
    if (isNaN(num)) {
      throw new Error("Input is not a valid number");
    }
      return parseFloat(str) < Number.MAX_SAFE_INTEGER;
  } catch (error) {
    console.error("Invalid input:", error.message);
    return false;
  }
};

export const calculateSum = (expenses) => {
  if (expenses?.length > 0) {
    const sum = expenses
      .reduce((sum, expense) => sum + parseFloat(expense.expense), 0)
      .toFixed(2); 
    return checkTheSafeNumber(sum) ? sum : false;
  }
  return 0;
};