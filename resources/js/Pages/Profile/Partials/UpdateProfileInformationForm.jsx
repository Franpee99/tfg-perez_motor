import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            direccion: user.direccion,
            provincia: user.provincia,
            codigo_postal: user.codigo_postal,
            telefono: user.telefono,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Información del perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Actualiza la información de tu perfil y dirección de correo electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="border rounded-md p-4 mt-4 shadow-sm">
                    <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Dirección de envío</h3>

                    <div className="mb-4">
                        <InputLabel htmlFor="direccion" value="Dirección" />
                        <TextInput
                            id="direccion"
                            className="mt-1 block w-full"
                            value={data.direccion}
                            onChange={(e) => setData('direccion', e.target.value)}
                            autoComplete="direccion"
                            isFocused
                        />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="provincia" value="Provincia" />
                        <TextInput
                            id="provincia"
                            className="mt-1 block w-full"
                            value={data.provincia}
                            onChange={(e) => setData('provincia', e.target.value)}
                            autoComplete="provincia"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="codigo_postal" value="Código Postal" />
                        <TextInput
                            id="codigo_postal"
                            className="mt-1 block w-full"
                            value={data.codigo_postal}
                            onChange={(e) => setData('codigo_postal', e.target.value)}
                            autoComplete="codigo_postal"
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="telefono" value="Teléfono / Móvil" />

                    <TextInput
                        id="telefono"
                        className="mt-1 block w-full"
                        value={data.telefono}
                        onChange={(e) => setData('telefono', e.target.value)}
                        autoComplete="telefono"
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Tu dirección de correo electrónico no está verificada.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
