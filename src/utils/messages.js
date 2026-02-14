/* eslint-disable security/detect-object-injection */
const messages = {
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
  INVALID_TOKEN: 'Invalid token!',
  DATA_NOT_FOUND: 'Data not found',
  USER_NOT_FOUND: 'User not found!',
  NOT_LOGGED_IN: 'Please login!',
  SESSION_EXPIRED: 'Your Session has expired. Please login again!',
  UNAUTHORIZED: 'Not Authorized',
  SYSTEM_USER_NOT_FOUND: 'System user not found!',
  TOKEN_EXPIRED: 'Token has expired',
  REQUIRED: 'is required!',
  INVALID_REQUEST: 'Invalid Request',
  INVALID_MOBILE_NUMBER: 'Invalid Mobile number',
  USER_ALREADY_EXISTS: 'User Already Exists',
  INVALID_PASSWORD: 'Invalid Password',
  SHOP_NOT_FOUND: 'Shop not found',
  CUSTOMER_NOT_FOUND: 'Customer not found',
  CANNOT_DELETE_CUSTOMER_WITH_DUE_AMOUNT: 'Cannot delete customer with due amount',
  BRANCH_NOT_FOUND: 'Branch not found',
  APPOINTMENT_NOT_FOUND: 'Appointment not found',
  BOOK_NOT_FOUND: 'Book not found',
  INVALID_OTP: 'Invalid OTP',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  PAID_AMOUNT_EXCEEDS_DUE: 'Paid amount cannot be greater than due amount',
};

const getMessage = key => {
  if (messages[key]) {
    return messages[key];
  }
  return 'Message Key not Found!!';
};

module.exports = { getMessage };
