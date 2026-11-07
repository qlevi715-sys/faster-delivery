import { PersonalInfo } from "../components/PersonalInfo"
import { ProfileSidebar } from "../components/ProfileSidebar"
import { useAuth } from "../context/useAuth"
import { ArrowLeft, User, Mail, Phone } from "lucide-react"
import { useProfileViewModel } from "../viewmodels/use-profile-user"

interface ProfilePageProps {
    onBackToDashboard: () => void
}

export const ProfilePage = ({ onBackToDashboard }: ProfilePageProps) => {
    console.log("PROFILE PAGE MOUNTED");
    const { user } = useAuth()
    const {
        form,
        handleChange,
        submit,
        isLoading,
        error,
        success
    }=useProfileViewModel()
    const fullName = `${user?.name ?? ""} ${user?.lastName ?? ""}`.trim()
    const handleShare = () => {
        const shareText = `${fullName} - ${user?.email ?? ""}`
        if (navigator.share) {
            navigator.share({ title: "Perfil", text: shareText }).catch(() => {})
        } else {
            navigator.clipboard.writeText(shareText).catch(() => {})
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">
                <button
                    type="button"
                    className="mb-5 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
                    onClick={onBackToDashboard}
                >
                    <ArrowLeft />
                    Volver al dashboard
                </button>

                <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <User className="h-8 w-8" />
                            </div>
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <h2 className="!text-2xl !font-bold text-slate-800">
                                    {fullName || "Usuario"}
                            </h2>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                    {user?.email && (
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            {user.email}
                                        </span>
                                    )}
                                    {user?.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            {user.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            onClick={handleShare}
                        >
                            Compartir
                        </button>
                    </div>
                </section>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
                    <ProfileSidebar />
                    <PersonalInfo 
                        user={user}
                        name={form.name}
                        lastname={form.lastname}
                        phone={form.phone}
                        onChange={handleChange}
                        onSave={submit}
                        isLoading={isLoading}
                        error={error}
                        success={success}
                    />
                </div>
            </div>
        </div>
    )
}