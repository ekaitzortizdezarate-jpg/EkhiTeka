'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { updateSiteImage } from '@/app/actions/site-images';
import {
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Layers,
  ShoppingBag,
  Gift,
  Wine,
  Store,
} from 'lucide-react';

interface SiteImageDef {
  key: string;
  section: string;
  title: string;
  description: string;
  defaultPath: string;
  icon: any;
}

const SITE_IMAGE_DEFS: SiteImageDef[] = [
  // 0. Inicio / Portada
  {
    key: 'home_hero',
    section: 'Inicio / Portada',
    title: 'Banner Principal de la Pantalla de Inicio',
    description: 'Imagen de fondo de la cabecera principal de bienvenida en la pantalla de inicio.',
    defaultPath: '/images/secciones/Tienda.JPG',
    icon: Sparkles,
  },
  // 1. Tienda & Tarjeta Visítanos
  {
    key: 'tienda_hero',
    section: 'Tienda & Catálogo',
    title: 'Banner Principal de la Tienda',
    description: 'Imagen de cabecera hero en la página de catálogo de la tienda.',
    defaultPath: '/images/secciones/Tienda.JPG',
    icon: ShoppingBag,
  },
  {
    key: 'shop_visit_card',
    section: 'Tienda & Catálogo',
    title: 'Tarjeta: Visítanos en Lekeitio · Tienda Física',
    description: 'Imagen de la tarjeta de presentación de la tienda física en la parte inferior de Inicio y Tienda.',
    defaultPath: '/images/secciones/Tienda.JPG',
    icon: Store,
  },
  // 2. Regalos Gourmet
  {
    key: 'gifts_hero',
    section: 'Regalos Gourmet',
    title: 'Banner Principal de Regalos',
    description: 'Imagen de cabecera en la sección de Regalos Gourmet.',
    defaultPath: '/images/secciones/Cestas.JPG',
    icon: Gift,
  },
  {
    key: 'gifts_card1',
    section: 'Regalos Gourmet',
    title: 'Tarjeta: Cestas Gourmet a Medida',
    description: 'Imagen destacada en el bloque editorial de Cestas Gourmet a Medida.',
    defaultPath: '/images/secciones/Cestas.JPG',
    icon: Gift,
  },
  {
    key: 'gifts_card2',
    section: 'Regalos Gourmet',
    title: 'Tarjeta: Packs Degustación & Maridaje',
    description: 'Imagen destacada en el bloque editorial de Packs Degustación.',
    defaultPath: '/images/secciones/Quesos.JPG',
    icon: Sparkles,
  },
  {
    key: 'gifts_card3',
    section: 'Regalos Gourmet',
    title: 'Tarjeta: Tarjetas & Catas de Regalo',
    description: 'Imagen destacada en el bloque editorial de Tarjetas de Regalo.',
    defaultPath: '/images/secciones/Mesas.JPG',
    icon: Wine,
  },
  // 3. Experiencias & Catas
  {
    key: 'exp_catas',
    section: 'Catas & Experiencias',
    title: 'Banner: Catas Presenciales & Guiadas',
    description: 'Imagen en el banner de Catas Presenciales en tienda o local.',
    defaultPath: '/images/secciones/Catas.JPG',
    icon: Wine,
  },
  {
    key: 'exp_mesas',
    section: 'Catas & Experiencias',
    title: 'Banner: Mesas de Quesos para Eventos',
    description: 'Imagen en el banner de Mesas de Quesos para bodas y eventos.',
    defaultPath: '/images/secciones/Mesas.JPG',
    icon: Sparkles,
  },
  {
    key: 'exp_cestas',
    section: 'Catas & Experiencias',
    title: 'Banner: Cestas y Experiencias de Regalo',
    description: 'Imagen en el banner de Cestas y Experiencias.',
    defaultPath: '/images/secciones/Cestas.JPG',
    icon: Gift,
  },
  // 4. Categorías de la Tienda
  {
    key: 'cat_quesos',
    section: 'Categorías de Productos',
    title: 'Categoría: Quesos Artesanos',
    description: 'Imagen en el círculo y filtros de la categoría Quesos.',
    defaultPath: '/images/secciones/Quesos.JPG',
    icon: Layers,
  },
  {
    key: 'cat_bonito',
    section: 'Categorías de Productos',
    title: 'Categoría: Atún & Bonito del Norte',
    description: 'Imagen en el círculo y filtros de la categoría Bonito.',
    defaultPath: '/images/secciones/Bonito.JPG',
    icon: Layers,
  },
  {
    key: 'cat_salazones',
    section: 'Categorías de Productos',
    title: 'Categoría: Salazones & Anchoas',
    description: 'Imagen en el círculo y filtros de la categoría Salazones.',
    defaultPath: '/images/secciones/Salazones.JPG',
    icon: Layers,
  },
  {
    key: 'cat_gildas',
    section: 'Categorías de Productos',
    title: 'Categoría: Gildas & Encurtidos',
    description: 'Imagen en el círculo y filtros de la categoría Gildas.',
    defaultPath: '/images/secciones/Gildas.JPG',
    icon: Layers,
  },
  {
    key: 'cat_cerveza',
    section: 'Categorías de Productos',
    title: 'Categoría: Cerveza Artesanal',
    description: 'Imagen en el círculo y filtros de la categoría Cerveza.',
    defaultPath: '/images/secciones/Cerveza.JPG',
    icon: Layers,
  },
  {
    key: 'cat_txakoli',
    section: 'Categorías de Productos',
    title: 'Categoría: Txakoli',
    description: 'Imagen en el círculo y filtros de la categoría Txakoli.',
    defaultPath: '/images/secciones/Txakoli.JPG',
    icon: Layers,
  },
  {
    key: 'cat_sidra',
    section: 'Categorías de Productos',
    title: 'Categoría: Sidra Vasca',
    description: 'Imagen en el círculo y filtros de la categoría Sidra.',
    defaultPath: '/images/secciones/Sidra.JPG',
    icon: Layers,
  },
];

export function SiteImagesManager() {
  const { language } = useLanguage();
  const { siteImages, getSiteImage, getSiteImageMeta } = useStoreConfig();
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDef = SITE_IMAGE_DEFS.find((d) => d.key === activeModalKey);

  const handleOpenEdit = (key: string) => {
    setActiveModalKey(key);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCustomUrlInput('');
    setFeedbackMsg(null);
  };

  const handleCloseModal = () => {
    setActiveModalKey(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCustomUrlInput('');
    setFeedbackMsg(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCustomUrlInput('');
    }
  };

  const handleSave = async () => {
    if (!activeDef) return;
    setIsSaving(true);
    setFeedbackMsg(null);

    const formData = new FormData();
    formData.set('image_key', activeDef.key);

    if (selectedFile) {
      formData.set('image_file', selectedFile);
    } else if (customUrlInput.trim()) {
      formData.set('image_url', customUrlInput.trim());
    } else {
      setFeedbackMsg({ type: 'error', text: 'Por favor selecciona un archivo o escribe una URL.' });
      setIsSaving(false);
      return;
    }

    const res = await updateSiteImage(formData);
    setIsSaving(false);

    if (res?.error) {
      setFeedbackMsg({ type: 'error', text: res.error });
    } else {
      setFeedbackMsg({ type: 'success', text: '¡Imagen actualizada correctamente en toda la web!' });
      setTimeout(() => {
        handleCloseModal();
        window.location.reload();
      }, 900);
    }
  };

  const handleResetToDefault = async (key: string) => {
    if (!confirm('¿Deseas restablecer esta imagen a su valor por defecto original?')) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.set('image_key', key);
    formData.set('reset_to_default', 'true');

    await updateSiteImage(formData);
    setIsSaving(false);
    window.location.reload();
  };

  // Agrupar por sección
  const sections = Array.from(new Set(SITE_IMAGE_DEFS.map((d) => d.section)));

  return (
    <div className="space-y-8 font-serif">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
              <ImageIcon className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1B] dark:text-stone-100 font-serif tracking-tight">
              {language === 'eu'
                ? 'Webguneko Irudiak eta Bannerrak'
                : language === 'fr'
                ? 'Images et Bannières du Site'
                : language === 'en'
                ? 'Website Images & Banners'
                : 'Imágenes y Banners de la Web'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 font-sans">
            {language === 'eu'
              ? 'Aldatu denda, opariak, dastaketak eta kategorietako irudiak. Kargatu zure fitxategia edo idatzi URL bat.'
              : language === 'fr'
              ? 'Modifiez les images de la boutique, des cadeaux, des dégustations et des catégories. Téléchargez votre fichier ou saisissez une URL.'
              : language === 'en'
              ? 'Customize hero banners, gifts, tastings, and category images across the site. Upload a file or provide a URL.'
              : 'Edita y personaliza todas las imágenes de secciones, banners y tarjetas de la web (tienda, regalos, catas, categorías).'}
          </p>
        </div>
      </div>

      {sections.map((secName) => {
        const items = SITE_IMAGE_DEFS.filter((d) => d.section === secName);

        return (
          <div key={secName} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
                {secName}
              </span>
              <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => {
                const currentImg = getSiteImage(item.key, item.defaultPath);
                const isCustomized = Boolean(siteImages[item.key]);
                const imgMeta = getSiteImageMeta(item.key);
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.key}
                    className="manduca-card bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 p-5 flex flex-col justify-between space-y-4 shadow-xs overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Imagen Preview */}
                      <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-stone-200/60 dark:border-stone-700/60 group">
                        <img
                          src={currentImg}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.defaultPath;
                          }}
                        />
                        {isCustomized && (
                          <div className="absolute top-2.5 right-2.5 max-w-[85%] bg-[#1D1D1B]/95 dark:bg-black/95 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl shadow-md border border-stone-700/60 font-sans text-right">
                            <p className="text-[10px] font-black text-[#FFE259] leading-tight truncate">
                              {imgMeta?.author_name || (language === 'eu' ? 'Aldatuta' : 'Modificada')}
                            </p>
                            <p className="text-[9px] text-stone-300 font-medium leading-tight">
                              {imgMeta?.updated_at
                                ? new Date(imgMeta.updated_at).toLocaleDateString(language === 'eu' ? 'eu-ES' : 'es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : new Date().toLocaleDateString(language === 'eu' ? 'eu-ES' : 'es-ES')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                          <IconComponent className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259] shrink-0" />
                          <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 font-sans">
                          {item.description}
                        </p>
                        {isCustomized && imgMeta?.author_name && (
                          <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[10.5px] font-sans text-stone-500 dark:text-stone-400">
                            <span className="truncate">
                              {language === 'eu' ? 'Aldatzailea:' : 'Modificado por:'}{' '}
                              <strong className="font-bold text-stone-800 dark:text-stone-200">{imgMeta.author_name}</strong>
                            </span>
                            {imgMeta.updated_at && (
                              <span className="shrink-0 text-[10px] text-stone-400">
                                {new Date(imgMeta.updated_at).toLocaleDateString(language === 'eu' ? 'eu-ES' : 'es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item.key)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{language === 'eu' ? 'Aldatu' : 'Cambiar'}</span>
                      </button>

                      {isCustomized && (
                        <button
                          type="button"
                          onClick={() => handleResetToDefault(item.key)}
                          title="Restablecer imagen original por defecto"
                          className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Modal de Cambio de Imagen */}
      {activeModalKey && activeDef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 font-serif">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259]">
                  {activeDef.section}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                  {activeDef.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Vista previa actual o seleccionada */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {language === 'eu' ? 'Irudiaren aurrebista:' : 'Vista previa de la imagen:'}
              </span>
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-stone-850 border border-stone-300 dark:border-stone-700">
                <img
                  src={previewUrl || customUrlInput.trim() || getSiteImage(activeDef.key, activeDef.defaultPath)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = activeDef.defaultPath;
                  }}
                />
              </div>
            </div>

            {/* Opciones de carga */}
            <div className="space-y-4 font-sans">
              {/* Opción A: Archivo local */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  1. Subir archivo desde tu ordenador:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-[#FFE259] bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#C68D07] dark:text-[#FFE259]" />
                  <span>
                    {selectedFile ? `Archivo: ${selectedFile.name}` : 'Seleccionar foto desde archivo...'}
                  </span>
                </button>
              </div>

              {/* Separador */}
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase">
                <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                <span>o bien</span>
                <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
              </div>

              {/* Opción B: URL externa */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  2. Introducir URL de imagen:
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/mi-imagen.jpg"
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    if (e.target.value) {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-[#FFE259] outline-hidden"
                />
              </div>
            </div>

            {/* Mensajes de feedback */}
            {feedbackMsg && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
              >
                {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="py-2.5 px-4 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || (!selectedFile && !customUrlInput.trim())}
                className="py-2.5 px-6 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Guardar y Aplicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
