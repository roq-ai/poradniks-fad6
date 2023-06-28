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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getHomeOwnerById, updateHomeOwnerById } from 'apiSdk/home-owners';
import { Error } from 'components/error';
import { homeOwnerValidationSchema } from 'validationSchema/home-owners';
import { HomeOwnerInterface } from 'interfaces/home-owner';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function HomeOwnerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HomeOwnerInterface>(
    () => (id ? `/home-owners/${id}` : null),
    () => getHomeOwnerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HomeOwnerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHomeOwnerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/home-owners');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<HomeOwnerInterface>({
    initialValues: data,
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
            Edit Home Owner
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'home_owner',
  operation: AccessOperationEnum.UPDATE,
})(HomeOwnerEditPage);
