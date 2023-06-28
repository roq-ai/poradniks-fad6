import * as yup from 'yup';

export const homeOwnerValidationSchema = yup.object().shape({
  request_status: yup.string().required(),
  user_id: yup.string().nullable(),
});
