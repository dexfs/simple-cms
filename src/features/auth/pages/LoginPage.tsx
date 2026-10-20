import {useState} from "react";

type LoginFormValues = {
    email: string,
    password: string
}

type FormTouchedValues = Partial<Record<keyof LoginFormValues, boolean>>

const initialFormValues: LoginFormValues = {
    email: '',
    password: ''
}

function validate(values: LoginFormValues) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isAValidEmail = !values.email.trim() ? 'Email é obrigatório'
        : !EMAIL_RE.test(values.email) ? 'Email inválido'
            : undefined;
    const isValidPassword = !values.password.trim() ? 'Password é obrigatório': undefined


    return {
        ...(isAValidEmail && {email: isAValidEmail}),
        ...(isValidPassword && {password: isValidPassword})
    }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function login(email:string, password:string) {
    await wait(1000)
    if (email !== "eve.holt@reqres.in" || password !== "cityslicka") {
        throw new Error("Invalid email or password.");   // failure = throw
    }
    return { token: "fake-token" };
}

export default function LoginPage() {
    const [values, setValues] = useState<LoginFormValues>(initialFormValues)
    const [touched, setTouched] = useState<FormTouchedValues>({})
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const errors = validate(values)
    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({email:true, password:true})
        if (Object.keys(errors).length > 0) return;
        setIsSubmiting(true)
        setSubmitError(null)
        login(values.email, values.password)
            .then(response => {
                console.log({response}) // redirect?
            })
            .catch(error => {
                const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
                setSubmitError(errorMessage)
            })
            .finally(() => setIsSubmiting(false))
    }

    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-600">Enter your email and password.</p>
            <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                {submitError &&
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                         role="alert">
                        {submitError}
                    </div>}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input id="email"
                           type="email"
                           autoComplete="email"
                           name="email"
                           placeholder="you@example.com"
                           className={`input-field${showEmailError ? ' input-field--error' : '' }`}
                           value={values.email}
                           onChange={(e) => setValues({...values, email: e.target.value})}
                           onBlur={() => setTouched((prev) => ({...prev, email: true}))}
                    />
                    {showEmailError &&
                        <p id="email-error" className="mt-1.5 text-xs text-red-600">{errors.email}.</p>}
                </div>

                <div>
                    <label htmlFor="password"
                           className="block text-sm font-medium text-slate-700">Password</label>
                    <input id="password" type="password" autoComplete="current-password" aria-invalid="true"
                           aria-describedby="password-error"
                           className={`input-field${showPasswordError ? ' input-field--error' : '' }`}
                           name="password"
                           value={values.password}
                           onChange={(e) => setValues({...values, password: e.target.value})}
                           onBlur={() => setTouched((prev) => ({...prev, password: true}))}
                    />
                    {showPasswordError && <p id="password-error" className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                </div>

                <button type="submit"
                        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        disabled={isSubmiting}
                >

                    {!isSubmiting ? 'Sign in' : 'Logging...'}
                </button>
            </form>
        </>
    )
}