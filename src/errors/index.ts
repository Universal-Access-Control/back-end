type StatusCode = 'INTERNAL_SERVER_ERROR' | 'USER_INPUT_ERROR';

interface Response {
  code: StatusCode;
  errors: [{ [key: string]: string }?];
  stack?: unknown;
}

export const Errors = {
  duplicate: '{PATH} already exist.',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatusCode = (ext: any): StatusCode => {
  return ext.exception?.errors || ext.exception.validationErrors ? 'USER_INPUT_ERROR' : ext.code;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any): Response => {
  const { extensions } = error;
  const res: Response = { errors: [], code: getStatusCode(extensions) };

  if (res.code !== 'INTERNAL_SERVER_ERROR') {
    const extErrorsObj = extensions.exception?.errors || {};
    Object.keys(extErrorsObj).map((errKey) => {
      res.errors.push({
        key: extErrorsObj[errKey].path,
        message: extErrorsObj[errKey].message,
        value: extErrorsObj[errKey].value,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extensions.exception?.validationErrors?.map((err: any) => {
      res.errors.push({
        key: err.property,
        message: Object.values<string>(err.constraints)[0],
        value: err.value,
      });
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    res.stack = error;
  }

  return res;
};