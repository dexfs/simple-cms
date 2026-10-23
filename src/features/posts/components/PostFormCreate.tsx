import {PostFormSchema, type PostFormValues} from "../schemas.ts";
import {useState} from "react";
import {usePost} from "../context/PostContext.tsx";
import {HttpError} from "../../../lib/http.ts";
import {z} from "zod";

const initialFormValues: PostFormValues = {
    title: '',
    body: ''
}

type PostFormErrors = Partial<Record<keyof PostFormValues, string>>
type FormTouchedValues = Partial<Record<keyof PostFormValues, boolean>>

function validate(values: PostFormValues): PostFormErrors {
    const result = PostFormSchema.safeParse(values)
    if (result.success) return {}

    const {fieldErrors} = z.flattenError(result.error)
    const title = fieldErrors.title?.[0]
    const body = fieldErrors.body?.[0]

    return {
        ...(title && {title}),
        ...(body && {body}),
    }
}

export default function PostFormCreate() {
    const {addPost} = usePost()
    const [values, setValues] = useState<PostFormValues>(initialFormValues)
    const [touched, setTouched] = useState<FormTouchedValues>({})
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const errors = validate(values)
    const showTitleError = touched.title && errors.title
    const showBodyError = touched.body && errors.body


    function handleClearForm(){
        setSuccess(false)
        setTouched({title: false, body: false})
        setSubmitError(null)
        setValues(initialFormValues)
    }

    function handleOnBlur(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name} = e.target
        setTouched((prev) => ({...prev, [name]: true}))
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = e.target
        setValues((prev) => ({...prev, [name]: value}))
        setSuccess(false)
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setTouched({title: true, body: true})
        setSuccess(false)
        if (Object.keys(errors).length > 0) return;
        setIsSubmiting(true)
        setSubmitError(null)
        addPost(values)
            .then(() => {
                handleClearForm()
                setSuccess(true)
            })
            .catch(error => {
                if (error instanceof HttpError) {
                    setSubmitError(error.message)
                } else {
                    console.error(error)
                    setSubmitError('Something went wrong. Please try again')
                }
            }).finally(() => setIsSubmiting(false))
    }


    return (
        <aside className="lg:sticky lg:top-24 lg:self-start">
            <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  noValidate onSubmit={handleSubmit}>
                <h2 className="font-semibold">New post</h2>

                <div>
                    <label htmlFor="title"
                           className="block text-sm font-medium text-slate-700">Title</label>
                    <input
                        id="title" type="text" aria-invalid={!!showTitleError}
                        name="title"
                        value={values.title}
                        aria-describedby="title-error"
                        className={`input-field${showTitleError ? ' input-field--error' : ''}`}
                        onBlur={handleOnBlur}
                        onChange={handleChange}
                    />
                    <div className="mt-1.5 flex justify-between text-xs">
                        {showTitleError && <p id="title-error" className="text-red-600">{errors.title}</p>}
                        <span className="text-slate-400">{values.title.length}/100</span>
                    </div>
                </div>

                <div>
                    <label htmlFor="body" className="block text-sm font-medium text-slate-700">Body</label>
                    <textarea id="body" rows={5} placeholder="Write something…"
                              name="body"
                              value={values.body}
                              onChange={handleChange}
                              onBlur={handleOnBlur}
                              className={`input-field${showBodyError ? ' input-field--error' : ''}`}></textarea>

                    <div className="mt-1.5 flex justify-between text-xs">
                        {showBodyError && <p id="body-error" className="text-red-600">{errors.body}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit"
                            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmiting}>
                        Publish
                    </button>
                    <button type="button"
                            onClick={handleClearForm}
                            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">Clear
                    </button>
                </div>

                {/*Success feedback after POST*/}
                {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                   role="status">Post published.</p>}
                {/*Error feedback after POST*/}
                {submitError && <p className="rounded-lg px-3 py-2 text-sm bg-red-50 border-red-200 text-red-700"
                   role="alert">{submitError}</p>}

            </form>
        </aside>
    )
}