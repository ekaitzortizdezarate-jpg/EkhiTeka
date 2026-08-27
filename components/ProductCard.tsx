'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { deleteProduct } from '@/app/actions/products';
import { ProductDescription } from '@/components/ProductDescription';
import {
  getProductImage,
  getProductDiscount,
  getCleanDescription,
  formatProductDescription,
  getGiftCardDescription,
  getTranslatedFormat,
  getTranslatedOrigin,
  getUnitsSuffix,
  getSeatsSuffix,
  getPackItems,
  getPeopleRange,
  getProductWeightOrVolume,
  getSellerDescription,
} from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, Ticket, MapPin, Pencil, Trash2, Check, MessageCircle, CreditCard, Package } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductCard({ product, isSeller = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUnlimited = Boolean(
    product.is_unlimited_stock ||
    product.stock === null ||
    product.stock === undefined ||
    (typeof product.stock === 'number' && product.stock >= 900)
  );

  const isSoldOut = !isUnlimited && (product.stock ?? 0) <= 0;
  const isLowStock = !isUnlimited && (product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0;
  const maxStock = isUnlimited ? 99 : Math.max(1, product.stock ?? 1);

  const isCataCasa =
    product.category_id === 'cata_casa' ||
    (product.name && product.name.toLowerCase().includes('cata en casa'));

  const isCataTienda =
    product.category_id === 'cata_presencial' ||
    product.category_id === 'catas' ||
    (product.name && (
      product.name.toLowerCase().includes('cata presencial') ||
      product.name.toLowerCase().includes('dastaketa presentziala') ||
      (product.name.toLowerCase().includes('cata') && !isCataCasa)
    ));

  const isGiftCard =
    product.category_id === 'tarjeta_regalo' ||
    (product.name && (
      product.name.toLowerCase().includes('tarjeta') ||
      product.name.toLowerCase().includes('txartel') ||
      product.name.toLowerCase().includes('gift card') ||
      product.name.toLowerCase().includes('carte cadeau')
    ));

  const isLoteGourmet =
    product.category_id === 'lote' ||
    product.category_id === 'lote_gourmet' ||
    product.category_id === 'cesta' ||
    product.category_id === 'cesta_gourmet' ||
    product.format === 'pack' ||
    (product.name && (
      product.name.toLowerCase().includes('lote') ||
      product.name.toLowerCase().includes('cesta') ||
      product.name.toLowerCase().includes('pack')
    ) && !isCataCasa && !isCataTienda && !isGiftCard);

  const sellerDescription = getSellerDescription(product.description);
  const isPackType = isCataCasa || isCataTienda || isLoteGourmet;
  const isEvent = isCataTienda;

  const imageUrl = getProductImage(product);
  const discountInfo = getProductDiscount(product);
  const cleanDescription = formatProductDescription(product.description, language);
  const giftCardDescription = getGiftCardDescription(product.description, language);
  const packItems = getPackItems(product);
  const peopleRange = getPeopleRange(product, language);
  const weightOrVolume = getProductWeightOrVolume(product, language);

  const sellerName = product.profiles?.full_name || 'EkhiTeka Gourmet Lekeitio';
  const sellerId = product.seller_id;
  const translatedOrigin = getTranslatedOrigin(product.origin_region, language);
  const translatedFormat = getTranslatedFormat(product.format, language);

  const getLowStockBadgeText = () => {
    if (isEvent) {
      if (language === 'eu') return `¡${product.stock} leku libre!`;
      if (language === 'fr') return `Plus que ${product.stock} places !`;
      if (language === 'en') return `Only ${product.stock} seats left!`;
      return `¡Últimas ${product.stock} plazas!`;
    }
    if (language === 'eu') return `¡Azken ${product.stock} unitate!`;
    if (language === 'fr') return `Plus que ${product.stock} unités !`;
    if (language === 'en') return `Only ${product.stock} left!`;
    return `¡Últimas ${product.stock} uds!`;
  };

  const getDeleteConfirmMessage = () => {
    if (language === 'eu') return `Ziur zaude "${product.name}" produktua EkhiTekako katalogotik ezabatu nahi duzula?`;
    if (language === 'fr') return `Voulez-vous supprimer « ${product.name} » du catalogue d’EkhiTeka ?`;
    if (language === 'en') return `Are you sure you want to remove "${product.name}" from the EkhiTeka catalog?`;
    return `¿Eliminar "${product.name}" del catálogo de EkhiTeka?`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || quantity <= 0) return;
    addToCart(product, sellerName, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(getDeleteConfirmMessage())) {
      setIsDeleting(true);
      await deleteProduct(product.id);
      window.location.reload();
    }
  };

  return (
    <article
      aria-label={product.name}
      className={`manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-[#E8E5DF] dark:border-[#2D2B27] hover:border-[#C8C1B3] dark:hover:border-stone-700 shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-300 font-serif ${
        isDeleting ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* 1. Imagen del Producto con Aspect Ratio 4:3 */}
      <div className="relative aspect-4/3 w-full bg-[#FAF7F2] dark:bg-stone-850 overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
          }}
        />

        {/* Origen (Top Left) */}
        {translatedOrigin && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1D1D1B]/90 dark:bg-black/90 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-[0.14em] shadow-xs max-w-[55%] truncate font-serif">
            <MapPin className="w-3 h-3 text-stone-300 shrink-0 stroke-[1.75]" />
            <span className="truncate">{translatedOrigin}</span>
          </span>
        )}

        {/* Stock Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 flex items-center font-serif">
          {isSoldOut ? (
            <span className="px-2.5 py-1 bg-[#1D1D1B]/90 text-stone-300 text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-[0.14em] shadow-md border border-stone-700/60">
              {isEvent ? (t.event_capacity_full || t.prod_sold_out) : t.prod_sold_out}
            </span>
          ) : isUnlimited ? (
            <span className="px-2.5 py-1 bg-[#1D1D1B]/90 dark:bg-black/90 backdrop-blur-xs text-stone-200 border border-stone-700/60 text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-[0.14em] shadow-md">
              {t.prod_unlimited}
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-[0.14em] shadow-md">
              {getLowStockBadgeText()}
            </span>
          ) : isEvent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF8F5]/95 dark:bg-[#1C1B19]/95 text-[#1D1D1B] dark:text-[#F5F5F0] border border-[#E8E5DF] dark:border-[#2D2B27] text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-[0.14em] shadow-xs backdrop-blur-xs">
              <Ticket className="w-3 h-3 stroke-[1.75]" />
              <span>{product.stock} {getSeatsSuffix(language, product.stock !== 1)}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#FAF8F5]/95 dark:bg-[#1C1B19]/95 text-[#1D1D1B] dark:text-[#F5F5F0] border border-[#E8E5DF] dark:border-[#2D2B27] text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-[0.14em] shadow-xs backdrop-blur-xs">
              {product.stock} {getUnitsSuffix(language, product.stock !== 1)}
            </span>
          )}
        </div>

        {/* Formato y Peso / Volumen (Bottom Left) */}
        {(translatedFormat || weightOrVolume) && (
          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs text-stone-800 dark:text-stone-200 text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-[0.14em] shadow-xs border border-[#E8E5DF] dark:border-[#2D2B27] font-serif">
            {translatedFormat ? translatedFormat : ''} {weightOrVolume ? `${translatedFormat ? '· ' : ''}${weightOrVolume}` : ''}
          </span>
        )}

        {/* Badge de Descuento (Bottom Right) */}
        {discountInfo && discountInfo.discountPercent > 0 && !isSoldOut && (
          <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#1D1D1B] text-white text-[10.5px] font-bold rounded-xl shadow-md font-serif tracking-[0.12em] border border-stone-700/60">
            -{discountInfo.discountPercent}%
          </span>
        )}
      </div>

      {/* 2. Cuerpo con Datos del Producto */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-[0.16em] truncate font-serif">
            {sellerName}
          </p>

          <Link
            href={`/producto/${product.id}`}
            className="block group-hover:text-stone-600 dark:group-hover:text-[#FFE259] transition-colors"
          >
            <h2 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg leading-snug break-words">
              {product.name}
            </h2>
          </Link>

          {isGiftCard ? (
            <div className="space-y-1 pt-1 font-serif">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-[0.14em]">
                <CreditCard className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
                <span>
                  {language === 'eu'
                    ? 'OPARI TXARTEL BIRTUALA:'
                    : language === 'fr'
                    ? 'CARTE CADEAU VIRTUELLE :'
                    : language === 'en'
                    ? 'VIRTUAL GIFT CARD:'
                    : 'TARJETA REGALO VIRTUAL:'}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-medium text-stone-800 dark:text-stone-200 leading-snug">
                {language === 'eu'
                  ? 'Produktuekin trukagarria'
                  : language === 'fr'
                  ? 'Échangeable contre des produits'
                  : language === 'en'
                  ? 'Redeemable for products'
                  : 'Canjeable por productos'}
              </p>
              {giftCardDescription && (
                <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed font-normal whitespace-pre-line line-clamp-2">
                  {giftCardDescription}
                </p>
              )}
            </div>
          ) : isPackType ? (
            <div className="space-y-2.5 pt-1 font-serif">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-[0.14em]">
                <Package className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300 stroke-[1.75] shrink-0" />
                <span>
                  {language === 'eu'
                    ? 'PACK-AK DAKARRENA:'
                    : language === 'fr'
                    ? 'LE PACK COMPREND :'
                    : language === 'en'
                    ? 'THE PACK INCLUDES:'
                    : 'EL PACK INCLUYE:'}
                </span>
              </div>

              {packItems.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {packItems.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#E8E5DF] dark:border-[#2D2B27] space-y-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200/60 dark:border-stone-700">
                          <img
                            src={item.imageUrl || '/images/secciones/Quesos.JPG'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate leading-tight">
                            {item.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-stone-500 dark:text-stone-400">
                            {item.quantity && item.quantity > 1 && (
                              <span className="font-bold text-[#C68D07] dark:text-[#FFE259]">
                                x{item.quantity}
                              </span>
                            )}
                            {item.weight_display && (
                              <span className="font-bold text-stone-700 dark:text-stone-300">
                                · {item.weight_display}
                              </span>
                            )}
                            {item.format && <span>· {item.format}</span>}
                          </div>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug pl-0.5 line-clamp-2 italic font-sans">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                  {packItems.length > 4 && (
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block text-right pr-1">
                      +{packItems.length - 4} {language === 'eu' ? 'gehiago' : language === 'fr' ? 'de plus' : language === 'en' ? 'more' : 'más'}
                    </span>
                  )}
                </div>
              )}

              {sellerDescription && (
                <div className="space-y-1 pt-1.5 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10.5px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block font-serif">
                    {language === 'eu'
                      ? 'Deskribapena:'
                      : language === 'fr'
                      ? 'Description :'
                      : language === 'en'
                      ? 'Description:'
                      : 'Descripción:'}
                  </span>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-normal whitespace-pre-line line-clamp-3">
                    {sellerDescription}
                  </p>
                </div>
              )}
            </div>
          ) : (
            cleanDescription && (
              <ProductDescription
                description={product.description}
                language={language}
                isCompact={true}
                className="pt-0.5"
              />
            )
          )}
        </div>

        {/* 3. Footer con Precio, Selector y Botón Principal Abajo */}
        <div className="pt-3 border-t border-[#E8E5DF] dark:border-[#2D2B27] space-y-3">
          {/* Fila 1: Precio y Selector de Cantidad / Chat */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="shrink-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.16em] block font-serif">
                {isCataCasa
                  ? (peopleRange || (language === 'eu' ? '2-4 lagunentzat' : language === 'fr' ? 'pour 2-4 personnes' : language === 'en' ? 'for 2-4 people' : 'para 2-4 personas'))
                  : t.prod_price}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-xl font-black text-[#1D1D1B] dark:text-stone-100 font-serif">
                  {Number(product.price).toFixed(2)} €
                </span>
                {discountInfo && discountInfo.originalPrice && discountInfo.originalPrice > Number(product.price) && (
                  <span className="text-[11px] text-stone-400 line-through font-serif font-semibold">
                    {discountInfo.originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>
            </div>

            {isSeller ? (
              <span className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#FAF8F5] dark:bg-[#1C1B19] text-stone-700 dark:text-stone-300 border border-[#E8E5DF] dark:border-[#2D2B27] font-serif uppercase tracking-[0.14em]">
                {isUnlimited ? t.prod_unlimited : `${t.prod_stock}: ${product.stock ?? 0} ${isEvent ? getSeatsSuffix(language, (product.stock ?? 0) !== 1) : getUnitsSuffix(language, (product.stock ?? 0) !== 1)}`}
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Selector de Cantidad */}
                {!isSoldOut && (
                  <div className="flex items-center rounded-xl border border-[#E8E5DF] dark:border-[#2D2B27] bg-[#FAF8F5] dark:bg-[#1C1B19] p-0.5 shadow-2xs font-serif">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantity((q) => Math.max(1, q - 1));
                      }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-black text-stone-900 dark:text-stone-100">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= maxStock}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantity((q) => Math.min(maxStock, q + 1));
                      }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                )}

                <Link
                  href={`/chat/${sellerId || ''}?product_id=${product.id}`}
                  className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1B19] hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors border border-[#E8E5DF] dark:border-[#2D2B27] shrink-0"
                  title={t.prod_ask_artisan}
                >
                  <MessageCircle className="w-4 h-4 text-stone-700 dark:text-stone-300 stroke-[1.75]" />
                </Link>
              </div>
            )}
          </div>

          {/* Fila 2: Botón Principal Abajo a Ancho Completo */}
          {isSeller ? (
            <div className="w-full flex items-center gap-2">
              <Link
                href={`/vendedor/productos/${product.id}/editar`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-bold text-xs transition-all shadow-2xs hover:scale-[1.01] font-serif uppercase tracking-[0.14em] cursor-pointer text-center"
                title={t.seller_edit_product || t.common_edit}
              >
                <Pencil className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{t.seller_edit_product || t.common_edit}</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-2xl bg-stone-100 hover:bg-red-50 dark:bg-stone-800 dark:hover:bg-red-950/40 text-stone-700 hover:text-red-700 dark:text-stone-300 dark:hover:text-red-400 transition-colors cursor-pointer border border-[#E8E5DF] dark:border-[#2D2B27] shrink-0"
                title={t.seller_delete_product || t.common_delete}
              >
                <Trash2 className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isSoldOut}
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-xs active:scale-98 font-serif cursor-pointer ${
                isSoldOut
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
                  : added
                  ? 'bg-[#1D1D1B] text-white dark:bg-white dark:text-[#1D1D1B]'
                  : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:shadow-md hover:scale-[1.01]'
              }`}
              title={isEvent ? t.event_reserve_seat : t.prod_add_to_cart}
            >
              {isSoldOut ? (
                <span>{isEvent ? (t.event_capacity_full || t.prod_sold_out) : t.prod_sold_out}</span>
              ) : added ? (
                <>
                  <Check className="w-4 h-4 stroke-[2]" />
                  <span>{t.prod_added}</span>
                </>
              ) : (
                <>
                  {isEvent ? <Ticket className="w-4 h-4 stroke-[1.75]" /> : <ShoppingBag className="w-4 h-4 stroke-[1.75]" />}
                  <span>{isEvent ? t.event_reserve_seat : t.prod_add_to_cart}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
