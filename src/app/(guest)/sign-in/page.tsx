import SignInForm from './signin-form';

const SignInPage = () => {
  return (
    <div className="grid lg:grid-cols-3 min-h-svh">
      <div className="lg:col-span-2 hidden lg:block"></div>
      <div className="flex flex-col p-6 md:p-10 lg:col-span-1">
        <div className="flex justify-center gap-2 md:justify-start">
          <p className="font-medium">Rumah Sakit Dr. Achmad Mochtar</p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
