import {useState} from "react";
import {useAuth} from "../../../components/context/AuthContext.tsx";

type LoginFormValues = {
    username: string,
    password: string
}

type FormTouchedValues = Partial<Record<keyof LoginFormValues, boolean>>

const initialFormValues: LoginFormValues = {
    username: '',
    password: ''
}

function validate(values: LoginFormValues) {
    const isValidUsername = !values.username.trim() ? 'Username é obrigatório' : undefined
    const isValidPassword = !values.password.trim() ? 'Password é obrigatório': undefined


    return {
        ...(isValidUsername && {username: isValidUsername}),
        ...(isValidPassword && {password: isValidPassword})
    }
}


export default function LoginPage() {
    const {login} = useAuth()
    const [values, setValues] = useState<LoginFormValues>(initialFormValues)
    const [touched, setTouched] = useState<FormTouchedValues>({})
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const errors = validate(values)
    const showUsernameError = touched.username && errors.username;
    const showPasswordError = touched.password && errors.password;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({username:true, password:true})
        if (Object.keys(errors).length > 0) return;
        setIsSubmiting(true)
        setSubmitError(null)
        login(values.username, values.password)
            .catch(error => {
                const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
                setSubmitError(errorMessage)
            })
            .finally(() => setIsSubmiting(false))
    }

    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-600">Enter your username and password.</p>
            <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                {submitError &&
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                         role="alert">
                        {submitError}
                    </div>}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                    <input id="username"
                           type="text"
                           autoComplete="username"
                           name="username"
                           placeholder="username"
                           className={`input-field${showUsernameError ? ' input-field--error' : '' }`}
                           value={values.username}
                           onChange={(e) => setValues({...values, username: e.target.value})}
                           onBlur={() => setTouched((prev) => ({...prev, username: true}))}
                           aria-invalid={!!showUsernameError}
                    />
                    {showUsernameError &&
                        <p id="username-error" className="mt-1.5 text-xs text-red-600">{errors.username}.</p>}
                </div>

                <div>
                    <label htmlFor="password"
                           className="block text-sm font-medium text-slate-700">Password</label>
                    <input id="password" type="password" autoComplete="current-password" aria-invalid={!!showPasswordError}
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