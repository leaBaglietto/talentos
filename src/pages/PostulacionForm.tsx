import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, User, Mail, Phone, Briefcase, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { RoleSelector } from '@/components/ui/RoleSelector';
import { supabase } from '@/lib/supabase';
import { detectFace } from '@/lib/faceDetection';
import { CandidateInsert } from '@/lib/types';

const formSchema = z.object({
  full_name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(6, 'Teléfono inválido'),
  roles: z.array(z.string()).min(1, 'Seleccioná al menos un rol'),
  experience_years: z.coerce.number().min(0, 'Ingresá los años de experiencia').max(50),
  work_history: z.string().min(2, 'Este campo es requerido'),
  portfolio_url: z.string().url('Ingresá una URL válida (ej: https://...)'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostulacionForm() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string>('');
  const [isValidatingFace, setIsValidatingFace] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roles: [],
    },
  });

  const handlePhotoSelect = async (file: File) => {
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setPhotoError('');
    setIsValidatingFace(true);

    try {
      const result = await detectFace(file);
      if (!result.detected) {
        setPhotoError(result.error || 'La foto debe ser un retrato claro con rostro visible (no se admiten logos ni marcas)');
      }
    } catch (error) {
      setPhotoError('Error al validar la imagen.');
    } finally {
      setIsValidatingFace(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitError('');
    if (!photoFile) {
      setPhotoError('Por favor subí una foto de perfil');
      return;
    }
    if (photoError) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload photo
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('freelancer-photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('freelancer-photos')
        .getPublicUrl(filePath);

      const candidateData: CandidateInsert = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        roles: data.roles,
        experience_years: data.experience_years,
        work_history: data.work_history,
        portfolio_url: data.portfolio_url,
        photo_url: publicUrlData.publicUrl,
      };

      const { error: insertError } = await supabase
        .from('candidates')
        .insert({ ...candidateData, status: 'pending' });

      if (insertError) throw insertError;

      navigate('/postulacion/exito');
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitError('Hubo un error al enviar tu postulación. Por favor intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4 sm:p-6 text-white font-sans relative overflow-x-hidden selection:bg-orange-500 selection:text-dark-900">
      {/* Dynamic ambient background glow */}
      <div className="absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-500/15 via-orange-600/5 to-transparent blur-[140px] pointer-events-none z-0"></div>

      {/* Brand Header */}
      <div className="z-10 mb-6 sm:mb-8 flex flex-col items-center">
        <Link to="/" className="transition-transform duration-300 hover:scale-105">
          <img
            src="/logos/JoyAgency_Logo.png"
            alt="Joy Agency"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Main Glass Card Box */}
      <div
        style={{
          paddingTop: '2%',
          paddingBottom: '2%',
          marginTop: '2%',
          marginBottom: '2%',
        }}
        className="z-10 w-full max-w-[620px] bg-dark-800/80 backdrop-blur-2xl border border-white/10 rounded-[36px] shadow-2xl shadow-black/80 flex flex-col items-center relative transition-all duration-300"
      >
        {/* Inner Form Container (80% width) */}
        <div className="w-[80%] flex flex-col items-center">
          
          {/* Submit Error */}
          {submitError && (
            <div className="w-full mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
            
            {/* Nombre y apellido */}
            <Input
              placeholder="Nombre y apellido"
              icon={<User className="w-5 h-5" />}
              error={errors.full_name?.message}
              {...register('full_name')}
            />

            {/* Email */}
            <Input
              type="email"
              placeholder="Email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Teléfono de contacto */}
            <Input
              type="tel"
              placeholder="Teléfono de contacto"
              icon={<Phone className="w-5 h-5" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Foto de perfil */}
            <FileUpload
              onFileSelect={handlePhotoSelect}
              error={photoError}
              previewUrl={photoPreview}
              label="Foto de perfil"
              accept="image/*"
              isValidating={isValidatingFace}
            />

            {/* Me postulo como */}
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <RoleSelector
                  selectedRoles={field.value}
                  onChange={field.onChange}
                  error={errors.roles?.message}
                />
              )}
            />

            {/* Años de experiencia */}
            <Input
              type="number"
              placeholder="Años de experiencia"
              icon={<Briefcase className="w-5 h-5" />}
              error={errors.experience_years?.message}
              {...register('experience_years')}
            />

            {/* Trabajé en */}
            <div className="w-full flex flex-col">
              <label className="text-xs sm:text-sm text-dark-200 mb-2 font-medium tracking-wide">
                Trabajé en
              </label>
              <textarea
                style={{ paddingLeft: '5%' }}
                className={`w-full bg-transparent hover:bg-orange-500/[0.02] border rounded-3xl p-4 pr-6 text-sm sm:text-base text-white placeholder-dark-300 outline-none focus:outline-none focus:ring-0 transition-colors min-h-[110px] resize-y
                  ${errors.work_history ? 'border-red-500 focus:border-red-400' : 'border-orange-500 focus:border-orange-400'}`}
                placeholder="Listá agencias, empresas o proyectos anteriores relevantes..."
                rows={4}
                {...register('work_history')}
              />
              {errors.work_history && (
                <span className="mt-1.5 px-3 text-xs text-red-400 font-medium">{errors.work_history.message}</span>
              )}
            </div>

            {/* Link a portfolio */}
            <Input
              type="url"
              placeholder="Link a portfolio (ej: https://...)"
              icon={<Globe className="w-5 h-5" />}
              error={errors.portfolio_url?.message}
              {...register('portfolio_url')}
            />

            {/* Submit button */}
            <div className="pt-2 w-full">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting || isValidatingFace}
                className="w-full rounded-full h-14 sm:h-16 text-base font-bold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98]"
              >
                Enviar postulación
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="z-10 mt-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-dark-400 hover:text-orange-400 text-sm font-medium transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}
