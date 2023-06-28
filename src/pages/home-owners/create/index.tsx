import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createHomeOwner } from 'apiSdk/home-owners';
import { Error } from 'components/error';
import { homeOwnerValidationSchema } from 'validationSchema/home-owners';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { HomeOwnerInterface } from 'interfaces/home-owner';

function HomeOwnerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HomeOwnerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHomeOwner(values);
      resetForm();
      router.push('/home-owners');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HomeOwnerInterface>({
    initialValues: {
      request_status: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: homeOwnerValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Home Owner
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="request_status" mb="4" isInvalid={!!formik.errors?.request_status}>
            <FormLabel>Request Status</FormLabel>
            <Input
              type="text"
              name="request_status"
              value={formik.values?.request_status}
              onChange={formik.handleChange}
            />
            {formik.errors.request_status && <FormErrorMessage>{formik.errors?.request_status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'home_owner',
  operation: AccessOperationEnum.CREATE,
})(HomeOwnerCreatePage);
