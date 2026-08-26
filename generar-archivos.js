const fs = require('fs');
const path = require('path');

const files = {
  // =========================================================================
  // 1. DICCIONARIO I18N (Traducciones del perfil en lectura/edición y contraseña)
  // =========================================================================
  'lib/i18n/translations.ts': `export type Language = 'eu' | 'es' | 'en' | 'fr';

export interface TranslationDict {
  brand_name: string;
  brand_tagline: string;
  brand_subtitle: string;
  top_refrigerated_shipping: string;
  top_custom_orders: string;
  top_store_pickup: string;

  // Nav
  nav_shop: string;
  nav_cart: string;
  nav_orders: string;
  nav_my_products: string;
  nav_chats: string;
  nav_admin: string;
  nav_login: string;
  nav_register: string;
  nav_profile: string;
  nav_logout: string;
  nav_gourmet_gifts: string;
  nav_gourmet_gifts_line1: string;
  nav_gourmet_gifts_line2: string;
  nav_tastings_experiences: string;
  nav_tastings_line1: string;
  nav_tastings_line2: string;
  nav_corporate_gifts: string;
  nav_corporate_line1: string;
  nav_corporate_line2: string;
  nav_events: string;
  nav_add_product: string;
  nav_add_product_line1: string;
  nav_add_product_line2: string;
  nav_explore_selection: string;
  nav_your_account: string;

  // Categories & Grid Subtitles
  cat_all: string;
  cat_queso: string;
  cat_atun: string;
  cat_salazon: string;
  cat_jildas: string;
  cat_cerveza: string;
  cat_txakoli: string;
  cat_sidra: string;
  cat_new_badge: string;
  cat_explore: string;
  cat_section_title: string;
  sub_quesos: string;
  sub_atun: string;
  sub_salazones: string;
  sub_gildas: string;
  sub_cerveza: string;
  sub_txakoli: string;
  sub_sidra: string;
  sub_cesta: string;
  sub_catas: string;
  sub_default: string;

  // Product Card & Details
  prod_price: string;
  prod_unit: string;
  prod_kg: string;
  prod_pack: string;
  prod_bottle: string;
  prod_can: string;
  prod_jar: string;
  prod_origin: string;
  prod_stock: string;
  prod_unlimited: string;
  prod_add_to_cart: string;
  prod_added: string;
  prod_ask_artisan: string;
  prod_consult_product: string;
  prod_details: string;
  prod_search_placeholder: string;
  prod_no_results: string;
  prod_sort_by: string;
  prod_sort_name_asc: string;
  prod_sort_name_desc: string;
  prod_sort_price_asc: string;
  prod_sort_price_desc: string;
  prod_showing: string;
  prod_sold_out: string;
  prod_last_units: string;
  prod_available: string;
  prod_availability: string;
  prod_format_label: string;
  prod_weight_label: string;
  prod_price_per_seat: string;
  prod_vat_included: string;
  prod_doubt_title: string;
  prod_doubt_desc: string;
  prod_ask_btn: string;
  prod_guarantee_cold: string;
  prod_guarantee_pickup: string;
  prod_guarantee_km0: string;
  prod_related_subtitle: string;
  prod_related_title: string;
  prod_back_to_selection: string;

  // Events & Tastings
  event_seats: string;
  event_seat: string;
  event_seats_available: string;
  event_capacity_full: string;
  event_last_seats: string;
  event_reserve_seat: string;
  event_seats_added: string;
  event_upcoming_title: string;
  event_upcoming_subtitle: string;
  event_catalog_title: string;
  event_catalog_subtitle: string;
  event_home_catalog_title: string;
  event_home_catalog_subtitle: string;
  event_store_catalog_title: string;
  event_store_catalog_subtitle: string;

  // Home Pillars & Banners
  home_hero_badge: string;
  home_hero_title: string;
  home_hero_subtitle: string;
  home_hero_desc: string;
  home_explore_btn: string;
  home_gourmet_gifts_btn: string;
  home_pillars_badge: string;
  home_pillars_title: string;
  home_pillars_desc: string;
  home_card1_badge: string;
  home_card1_sub: string;
  home_card1_title: string;
  home_card1_desc: string;
  home_card1_btn: string;
  home_card2_badge: string;
  home_card2_sub: string;
  home_card2_title: string;
  home_card2_desc: string;
  home_card2_btn: string;
  home_card3_badge: string;
  home_card3_sub: string;
  home_card3_title: string;
  home_card3_desc: string;
  home_card3_btn: string;
  home_card4_badge: string;
  home_card4_sub: string;
  home_card4_title: string;
  home_card4_desc: string;
  home_card4_btn: string;

  // Experience Banners (Home)
  exp_banner_badge: string;
  exp_banner_title: string;
  exp_b1_title: string;
  exp_b1_desc: string;
  exp_b1_btn: string;
  exp_b2_title: string;
  exp_b2_desc: string;
  exp_b2_btn: string;
  exp_b3_title: string;
  exp_b3_desc: string;
  exp_b3_btn: string;

  // Experiences Page (Cards & Banners)
  exp_hero_badge: string;
  exp_hero_title: string;
  exp_hero_title_highlight: string;
  exp_hero_desc: string;
  exp_home_tasting_title: string;
  exp_home_tasting_badge: string;
  exp_home_tasting_desc: string;
  exp_home_tasting_btn: string;
  exp_store_tasting_title: string;
  exp_store_tasting_badge: string;
  exp_store_tasting_desc: string;
  exp_store_tasting_btn: string;
  exp_wedding_title: string;
  exp_wedding_badge: string;
  exp_wedding_desc: string;
  exp_wedding_btn: string;
  exp_raclette_title: string;
  exp_raclette_badge: string;
  exp_raclette_desc: string;
  exp_raclette_btn: string;

  // Gourmet Gifts Page
  gifts_hero_badge: string;
  gifts_hero_title: string;
  gifts_hero_title_highlight: string;
  gifts_hero_desc: string;
  gifts_whatsapp_btn: string;
  gifts_card1_title: string;
  gifts_card1_desc: string;
  gifts_card1_feature: string;
  gifts_card2_title: string;
  gifts_card2_desc: string;
  gifts_card2_feature: string;
  gifts_card3_title: string;
  gifts_card3_desc: string;
  gifts_card3_feature: string;
  gifts_catalog_badge: string;
  gifts_catalog_title: string;

  // Corporate Gifts Page
  corp_hero_badge: string;
  corp_hero_title: string;
  corp_hero_title_highlight: string;
  corp_hero_desc: string;
  corp_whatsapp_btn: string;
  corp_card1_title: string;
  corp_card1_desc: string;
  corp_card2_title: string;
  corp_card2_desc: string;
  corp_card3_title: string;
  corp_card3_desc: string;
  corp_logistics_badge: string;
  corp_logistics_title: string;
  corp_logistics_desc: string;
  corp_logistics_feat1: string;
  corp_logistics_feat2: string;
  corp_logistics_feat3: string;

  // Customer Reviews
  reviews_badge: string;
  reviews_title: string;
  reviews_subtitle: string;
  reviews_verified_buyer: string;
  rev1_comment: string;
  rev1_date: string;
  rev2_comment: string;
  rev2_date: string;
  rev3_comment: string;
  rev3_date: string;

  // Cart & Checkout
  cart_title: string;
  cart_empty: string;
  cart_empty_sub: string;
  cart_explore_btn: string;
  cart_subtotal: string;
  cart_total: string;
  cart_checkout: string;
  cart_remove: string;
  cart_quantity: string;
  cart_continue_shopping: string;
  deliv_choose_mode: string;
  deliv_home: string;
  deliv_home_desc: string;
  deliv_store_pickup: string;
  deliv_store_pickup_desc: string;
  deliv_shipping_address: string;
  deliv_shipping_notes: string;
  deliv_pickup_time: string;
  deliv_pickup_address: string;
  deliv_confirm_order: string;
  deliv_order_success: string;
  deliv_order_success_desc: string;
  deliv_store_pickup_tag: string;
  deliv_home_tag: string;

  // Orders & Statuses
  orders_title: string;
  orders_title_seller: string;
  orders_subtitle_buyer: string;
  orders_subtitle_seller: string;
  orders_status: string;
  orders_pending: string;
  orders_confirmed: string;
  orders_preparing: string;
  orders_ready_delivery: string;
  orders_delivered: string;
  orders_cancelled: string;
  orders_change_status: string;
  orders_cancel_order: string;
  orders_cancel_reason: string;
  orders_chat_with_buyer: string;
  orders_chat_with_seller: string;
  orders_no_orders: string;
  orders_no_orders_seller: string;
  orders_no_orders_seller_sub: string;
  orders_products_label: string;
  orders_products_to_prepare: string;
  orders_purchase_date: string;
  orders_date_time: string;
  orders_order_number: string;
  orders_total_to_charge: string;
  orders_new_status: string;
  orders_mark_seen: string;
  orders_client_label: string;
  orders_qty_label: string;

  status_confirm: string;
  status_preparing: string;
  status_ready: string;
  status_delivered: string;

  // Profile Page & Fields
  profile_title: string;
  profile_subtitle: string;
  profile_personal_data: string;
  profile_address_data: string;
  profile_security: string;
  profile_first_name: string;
  profile_last_name_1: string;
  profile_last_name_2: string;
  profile_birth_date: string;
  profile_dni: string;
  profile_phone: string;
  profile_province: string;
  profile_town: string;
  profile_postal_code: string;
  profile_street: string;
  profile_number: string;
  profile_stair: string;
  profile_floor: string;
  profile_door: string;
  profile_current_password: string;
  profile_new_password: string;
  profile_confirm_password: string;
  profile_change_password_btn: string;
  profile_save_changes_btn: string;
  profile_edit_btn: string;
  profile_not_specified: string;
  profile_full_address: string;

  // Roles & Auth
  role_buyer: string;
  role_seller: string;
  role_admin: string;
  auth_email: string;
  auth_password: string;
  auth_full_name: string;
  auth_phone: string;
  auth_town: string;
  auth_have_account: string;
  auth_no_account: string;

  // Legal & Cookies
  legal_terms: string;
  legal_privacy: string;
  legal_cookies: string;
  legal_notice: string;
  cookie_text: string;
  cookie_accept: string;
  cookie_reject: string;
  cookie_settings: string;

  // Footer
  footer_club_title: string;
  footer_club_subtitle: string;
  footer_club_desc: string;
  footer_join_whatsapp: string;
  footer_cheese_desc: string;
  footer_delivery_desc: string;
  footer_pickup_desc: string;
  footer_categories: string;
  footer_experiences: string;
  footer_legal: string;
  footer_schedule_title: string;
  footer_schedule_weekdays: string;
  footer_schedule_saturday: string;
  footer_copyright: string;
  footer_tagline: string;
  footer_exp_tasting: string;
  footer_exp_weddings: string;
  footer_exp_gifts: string;
  footer_exp_consult: string;

  // Common
  common_save: string;
  common_cancel: string;
  common_delete: string;
  common_edit: string;
  common_back: string;
  common_loading: string;
  common_success: string;
  common_error: string;
  common_theme_light: string;
  common_theme_dark: string;
  common_theme_system: string;
  common_select_language: string;
}

export const LOCALE_MAP: Record<Language, string> = {
  eu: 'eu',
  es: 'es-ES',
  en: 'en-GB',
  fr: 'fr-FR',
};

export const translations: Record<Language, TranslationDict> = {
  eu: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Gourmet Denda & Artisau Produktuak',
    brand_subtitle: 'Gaztak, hegaluzea, gatzadurak, gildak, garagardo artisaua, txakolina eta sagardo hautatua.',
    top_refrigerated_shipping: 'Bidalpen hoztua 24/48h penintsulan',
    top_custom_orders: 'Eskari bereziak eta aholkularitza',
    top_store_pickup: 'Dendan jasotzeko aukera',

    nav_shop: 'Denda',
    nav_cart: 'Saskia',
    nav_orders: 'Eskaerak',
    nav_my_products: 'Nire Produktuak',
    nav_chats: 'Mezuak',
    nav_admin: 'Admin',
    nav_login: 'Hasi Saioa',
    nav_register: 'Erregistratu',
    nav_profile: 'Profila',
    nav_logout: 'Itxi Saioa',
    nav_gourmet_gifts: 'Opari Gourmetak',
    nav_gourmet_gifts_line1: 'Opari',
    nav_gourmet_gifts_line2: 'Gourmetak',
    nav_tastings_experiences: 'Dastaketak & Esperientziak',
    nav_tastings_line1: 'Dastaketak &',
    nav_tastings_line2: 'Esperientziak',
    nav_corporate_gifts: 'Enpresa Opariak',
    nav_corporate_line1: 'Enpresa',
    nav_corporate_line2: 'Opariak',
    nav_events: 'Ekitaldiak',
    nav_add_product: 'Gehitu Produktua',
    nav_add_product_line1: 'Gehitu',
    nav_add_product_line2: 'Produktua',
    nav_explore_selection: 'Arakatu Hautaketa',
    nav_your_account: 'Zure Kontua',

    cat_all: 'Guztiak',
    cat_queso: 'Gazta',
    cat_atun: 'Hegaluzea',
    cat_salazon: 'Gatzadura',
    cat_jildas: 'Gildak',
    cat_cerveza: 'Garagardo artisaua',
    cat_txakoli: 'Txakolina',
    cat_sidra: 'Sagardoa',
    cat_new_badge: 'Berritasuna',
    cat_explore: 'Arakatu atala',
    cat_section_title: 'EkhiTeka Hautaketaren Kategoriak',
    sub_quesos: 'Artisau & Afinatuak',
    sub_atun: 'Kantauri Kostaldea',
    sub_salazones: 'Antxoak & Gatzadurak',
    sub_gildas: 'Gildak & Ozpinetakoak',
    sub_cerveza: 'Garagardo Bereziak',
    sub_txakoli: 'Bizkaiko Txakolina',
    sub_sidra: 'Euskal Sagardoa',
    sub_cesta: 'Opari Saskiak',
    sub_catas: 'Dastaketak & Tailerrak',
    sub_default: 'Gourmet Hautaketa',

    prod_price: 'Prezioa',
    prod_unit: 'unitate',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'botila',
    prod_can: 'lata',
    prod_jar: 'potoa',
    prod_origin: 'Jatorria',
    prod_stock: 'Stocka',
    prod_unlimited: 'Mugagabea',
    prod_add_to_cart: 'Gehitu saskira',
    prod_added: 'Gehituta',
    prod_ask_artisan: 'Galdetu artisauari',
    prod_consult_product: 'Produktu honi buruzko kontsulta',
    prod_details: 'Xehetasunak',
    prod_search_placeholder: 'Bilatu gazta, hegaluzea, txakolina...',
    prod_no_results: 'Ez da produkturik aurkitu',
    prod_sort_by: 'Ordenatu',
    prod_sort_name_asc: 'Izena (A-Z)',
    prod_sort_name_desc: 'Izena (Z-A)',
    prod_sort_price_asc: 'Prezioa (baxuena lehenik)',
    prod_sort_price_desc: 'Prezioa (altuena lehenik)',
    prod_showing: 'produktu erabilgarri erakusten',
    prod_sold_out: 'Agortuta',
    prod_last_units: 'Azken unitateak!',
    prod_available: 'Eskuragarri',
    prod_availability: 'Eskuragarritasuna:',
    prod_format_label: 'Formatua',
    prod_weight_label: 'Pisua',
    prod_price_per_seat: '/ lekua',
    prod_vat_included: 'BEZ barne',
    prod_doubt_title: 'Produktu honi buruzko zalantzarik duzu?',
    prod_doubt_desc: 'Kontsultatu zuzenean gure gazta maisu eta adituekin.',
    prod_ask_btn: 'Galdetu',
    prod_guarantee_cold: 'Hotz bermatua 24/48h',
    prod_guarantee_pickup: 'Jasotzea Lekeition',
    prod_guarantee_km0: 'Artisau kalitatea km0',
    prod_related_subtitle: 'Afinatzailearen gomendioak',
    prod_related_title: 'Zuretzat interesgarria izan daiteke',
    prod_back_to_selection: 'Itzuli hautaketara',

    event_seats: 'leku',
    event_seat: 'leku',
    event_seats_available: 'leku libre',
    event_capacity_full: 'Leku guztiak beteta (Agortuta)',
    event_last_seats: 'Azken lekuak!',
    event_reserve_seat: 'Erreserbatu Lekua',
    event_seats_added: 'Lekua gehituta',
    event_upcoming_title: 'Dastaketa Presentzialen Hurrengo Ekitaldiak',
    event_upcoming_subtitle: 'Leku mugatuak · Lekeitioko erdigunean',
    event_catalog_title: 'Eskuragarri dauden Dastaketak eta Esperientziak',
    event_catalog_subtitle: 'Dastaketak dendan eta etxerako kit-ak',
    event_home_catalog_title: 'Etxerako Dastaketa Kit-ak',
    event_home_catalog_subtitle: 'Kit-ak eta pack-ak etxera eramateko',
    event_store_catalog_title: 'Dendako Dastaketak Eskuragarri',
    event_store_catalog_subtitle: 'Presentziala Lekeition',

    home_hero_badge: 'Gaztategi Gourmet & Gune Gastronomikoa',
    home_hero_title: 'Egile-gaztak & Esperientziak Lekeition',
    home_hero_subtitle: 'Egile-gaztak & Esperientziak Lekeition',
    home_hero_desc: 'Gazta berezien artisau afinatzea, Kantauri itsasoko altxorrak eta hautatutako maridajeak.',
    home_explore_btn: 'Arakatu Online Denda',
    home_gourmet_gifts_btn: 'Opari Gourmetak',
    home_pillars_badge: 'Gure Etxea · EkhiTeka Unibertsoa',
    home_pillars_title: 'Ezagutu Gure Atalak',
    home_pillars_desc: 'Hautatu bilatzen duzun esperientzia eta utzi gure artisau afinatzeak gidatzen.',
    home_card1_badge: 'Online & Bidalketa',
    home_card1_sub: 'Katalogo Osoa',
    home_card1_title: 'Denda Gourmet',
    home_card1_desc: 'Gazta afinatuak, Kantauriko hegaluzea, gatzadurak, artisau gildak, txakolina eta sagardoa.',
    home_card1_btn: 'Sartu Dendara',
    home_card2_badge: 'Oparitzeko',
    home_card2_sub: 'Xehetasunak & Saskiak',
    home_card2_title: 'Opari Gourmetak',
    home_card2_desc: 'Pertsonalizatutako saski gourmetak, etxerako dastaketa kit-ak eta opari txartelak.',
    home_card2_btn: 'Ikusi Opari Aukerak',
    home_card3_badge: 'Sentsoriala',
    home_card3_sub: 'Dendan & Ekitaldietan',
    home_card3_title: 'Dastaketak & Esperientziak',
    home_card3_desc: 'Dastaketak etxean, aurrez aurreko dastaketak Lekeitioko dendan eta ezkontzetarako mahaiak.',
    home_card3_btn: 'Ezagutu Esperientziak',
    home_card4_badge: 'Korporatiboa',
    home_card4_sub: 'Taldeak & Bezeroak',
    home_card4_title: 'Enpresa Opariak',
    home_card4_desc: 'Teambuilding gastronomikoa, egile-gabonetako saskiak eta enpresa xehetasunak.',
    home_card4_btn: 'Ikusi Enpresa Zerbitzuak',

    exp_banner_badge: 'Hemen gauzak gertatzen dira...',
    exp_banner_title: 'Dastaketak, Ekitaldiak & EkhiTeka Esperientziak',
    exp_b1_title: 'Dastaketa Presentzialak & Tailerrak',
    exp_b1_desc: 'Ikasi nazioarteko eta tokiko artisau gaztak dastatzen Lekeition.',
    exp_b1_btn: 'Kontsultatu Hurrengo Datak',
    exp_b2_title: 'Gazta Mahaiak Ezkontza & Festetarako',
    exp_b2_desc: 'Cheese Corner ikusgarriak prestatzen ditugu lore jangarriekin.',
    exp_b2_btn: 'Eskatu Ekitaldi Aurrekontua',
    exp_b3_title: 'Gourmet Saskiak & Enpresa Opariak',
    exp_b3_desc: 'Kaxa gastronomiko esklusiboak diseinatzen ditugu.',
    exp_b3_btn: 'Konfiguratu Saskia Neurrirako',

    exp_hero_badge: 'Esperientzia Gastronomikoak',
    exp_hero_title: 'Dastaketak &',
    exp_hero_title_highlight: 'Esperientziak',
    exp_hero_desc: 'Ezagutu artisau gaztaren artea gure dastaketa gidatuen bidez.',
    exp_home_tasting_title: 'Dastaketak Etxean',
    exp_home_tasting_badge: 'Zure erritmoan',
    exp_home_tasting_desc: 'Bihur zaitez anfitrioi gure dastaketa-kit osoekin.',
    exp_home_tasting_btn: 'Eskatu Kit-a Etxerako',
    exp_store_tasting_title: 'Dastaketak Dendan',
    exp_store_tasting_badge: 'Presentziala Lekeition',
    exp_store_tasting_desc: 'Esperientzia presentzial esklusiboak Lekeitioko gure gaztategian.',
    exp_store_tasting_btn: 'Ikusi Datak & Erreserbatu Lekua',
    exp_wedding_title: 'Ezkontzetarako Mahaia',
    exp_wedding_badge: 'Ezkontzak & Ekitaldiak',
    exp_wedding_desc: 'Gazta-mahai ikusgarriak sortzen ditugu ezkontzetako kokteletarako.',
    exp_wedding_btn: 'Eskatu Aurrekontua Ezkontzetarako',
    exp_raclette_title: 'Raclette Mailegua',
    exp_raclette_badge: 'Alokairua & Pack-a',
    exp_raclette_desc: 'Suitzar raclette makina profesionala mailegatzen dizugu.',
    exp_raclette_btn: 'Kontsultatu Raclette Eskuragarritasuna',

    gifts_hero_badge: 'Oparitzeko Hautaketa Esklusiboa',
    gifts_hero_title: 'Opari',
    gifts_hero_title_highlight: 'Gourmetak',
    gifts_hero_desc: 'Harritu neurrira egindako artisau saskiekin, gazta afinatuen estutxeekin eta opari txartelekin.',
    gifts_whatsapp_btn: 'Eskari Pertsonalizatua WhatsApp Bidez',
    gifts_card1_title: 'Gourmet Saskiak Neurrirako',
    gifts_card1_desc: 'Artisau saskiak diseinatzen ditugu zati afinatuak eta euskal gozoak konbinatuz.',
    gifts_card1_feature: 'Bidalpen hoztua dedikatoria txartelarekin',
    gifts_card2_title: 'Dastaketa & Maridaje Pack-ak',
    gifts_card2_desc: 'Ireki eta gozatzeko prestatutako estutxe tematikoak.',
    gifts_card2_feature: 'Aurkezpena egurrezko kaxa prémiumean',
    gifts_card3_title: 'Opari Txartelak & Dastaketak',
    gifts_card3_desc: 'Opari aproposa beren gazta gogokoenak aukera ditzaten.',
    gifts_card3_feature: 'Baliozkoa online eta denda fisikoan',
    gifts_catalog_badge: 'Bidalpenerako edo jasotzeko eskuragarri',
    gifts_catalog_title: 'Oparitzeko Prest dauden Saskiak & Pack-ak',

    corp_hero_badge: 'Enpresa Irtenbideak & Gabonetako Loteak',
    corp_hero_title: 'Enpresa',
    corp_hero_title_highlight: 'Opariak',
    corp_hero_desc: 'Eskerrak eman zure talde eta bezeroen konfiantzagatik lote gastronomiko artisauekin.',
    corp_whatsapp_btn: 'Eskatu Enpresa Aurrekontua WhatsApp Bidez',
    corp_card1_title: 'Gabonetako Loteak eta Saskiak',
    corp_card1_desc: 'Tartekaririk gabeko konposizio premiumak: afinatzailearen gaztak eta maridajeak.',
    corp_card2_title: 'Dastaketa Pribatuak & Team Building',
    corp_card2_desc: 'Enpresa ekitaldiak eta talde jarduera gidatuak antolatzen ditugu.',
    corp_card3_title: 'Pertsonalizazioa Zure Markarekin',
    corp_card3_desc: 'Faja pertsonalizatuak eta zure enpresaren logotipoa.',
    corp_logistics_badge: 'EkhiTeka Konpromisoa',
    corp_logistics_title: 'Logistika Bikaina eta Bidalpen Anitzak',
    corp_logistics_desc: 'Langile edo bezeroen helbideetara 24/48 ordutan bidaltzeko kudeaketa osoa.',
    corp_logistics_feat1: 'Bidalpen indibidualak langile bakoitzari',
    corp_logistics_feat2: 'Garraio hoztu homologatua',
    corp_logistics_feat3: 'Fakturazio zehatza BEZ bananduta',

    reviews_badge: 'Konfiantza & Gastronomia Pasioa',
    reviews_title: 'Gure Bezeroen Iritziak',
    reviews_subtitle: 'Gure hautaketa probatu duten gazta-zaleek diotena',
    reviews_verified_buyer: 'Erosle egiaztatua',
    rev1_comment: 'Gaztak benetako zoramena dira. Afinatze perfektua eta bidalketa hoztua 24 ordutan iritsi zen ezin hobeto.',
    rev1_date: 'Duela 3 egun',
    rev2_comment: 'Urtebetetze baterako gazta eta kontserba taula bat eskatu nuen eta gonbidatu guztiak txundituta geratu ziren.',
    rev2_date: 'Duela astebete',
    rev3_comment: 'Hilero erosten dut gazta eta antxoa hautaketa. Produktua guztiz fresko iristen da.',
    rev3_date: 'Duela 2 aste',

    cart_title: 'Zure Saskia',
    cart_empty: 'Saskia hutsik dago',
    cart_empty_sub: 'Arakatu gure produktu gourmetak eta gehitu zure gogokoenak.',
    cart_explore_btn: 'Ikusi Produktuak',
    cart_subtotal: 'Azpitotusa',
    cart_total: 'Guztira',
    cart_checkout: 'Bideratu Eskaera',
    cart_remove: 'Kendu',
    cart_quantity: 'Kopurua',
    cart_continue_shopping: 'Jarraitu Erosketak',
    deliv_choose_mode: 'Aukeratu jasotzeko modua',
    deliv_home: 'Etxera bidaltzea',
    deliv_home_desc: 'Garraio hoztuan zure atean 24-48 ordutan',
    deliv_store_pickup: 'Dendan jasotzea',
    deliv_store_pickup_desc: 'Gure saltokian jaso ordutegi barruan',
    deliv_shipping_address: 'Bidalketa helbidea',
    deliv_shipping_notes: 'Bidalketarako oharrak',
    deliv_pickup_time: 'Jasotzeko gutxi gorabeherako ordua',
    deliv_pickup_address: 'Dendaren helbidea: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Berretsi eta Bidali Eskaera',
    deliv_order_success: 'Eskaera ongi burutu da!',
    deliv_order_success_desc: 'Saltzaileak zure eskaera jaso du eta prestatzen hasiko da.',
    deliv_store_pickup_tag: 'Lekeitioko dendan jasotzea',
    deliv_home_tag: 'Etxera bidaltzea',

    orders_title: 'Nire Eskaerak',
    orders_title_seller: 'Eskaerak Kudeatu',
    orders_subtitle_buyer: 'Zure erosketen jarraipena, produktuak eta egoera.',
    orders_subtitle_seller: 'Bezeroen eskaerak kudeatu, egoera eguneratu eta produktuak prestatu.',
    orders_status: 'Egoera',
    orders_pending: 'Balioztatzeko',
    orders_confirmed: 'Balioztatuta',
    orders_preparing: 'Prestatzen',
    orders_ready_delivery: 'Banatzeko prest',
    orders_delivered: 'Entregatuta',
    orders_cancelled: 'Ezeztatuta',
    orders_change_status: 'Aldatu egoera',
    orders_cancel_order: 'Ezeztatu eskaera',
    orders_cancel_reason: 'Ezeztatze arrazoia',
    orders_chat_with_buyer: 'Hitz egin bezeroarekin',
    orders_chat_with_seller: 'Hitz egin saltzailearekin',
    orders_no_orders: 'Ez duzu eskaerarik oraindik',
    orders_no_orders_seller: 'Ez dago eskaerarik oraindik',
    orders_no_orders_seller_sub: 'Bezeroek egindako eskaerak hemen agertuko dira.',
    orders_products_label: 'Eskaerako Produktuak',
    orders_products_to_prepare: 'Prestatzeko Produktuak',
    orders_purchase_date: 'Erosketa data',
    orders_date_time: 'Data eta ordua',
    orders_order_number: 'Eskaera:',
    orders_total_to_charge: 'Kobratzekoa:',
    orders_new_status: 'Egoera berria! Zure eskaera aldatu da:',
    orders_mark_seen: 'Ikusia markatu',
    orders_client_label: 'Bezeroa',
    orders_qty_label: 'Kantitatea',

    status_confirm: 'Baieztatu',
    status_preparing: 'Prestatzen',
    status_ready: 'Prest',
    status_delivered: 'Entregatuta',

    // Perfil
    profile_title: 'Nire Profila',
    profile_subtitle: 'Kudeatu zure harremanetarako datuak, bidalketa helbidea eta segurtasuna.',
    profile_personal_data: 'Datu Pertsonalak',
    profile_address_data: 'Bidalketa Helbidea & Harremana',
    profile_security: 'Segurtasuna & Pasahitza Aldatu',
    profile_first_name: 'Izena',
    profile_last_name_1: '1. Abizena',
    profile_last_name_2: '2. Abizena',
    profile_birth_date: 'Jaiotze Data',
    profile_dni: 'NAN / DNI',
    profile_phone: 'Telefonoa',
    profile_province: 'Probintzia',
    profile_town: 'Herria / Hiria',
    profile_postal_code: 'Posta Kodea',
    profile_street: 'Kalea / Helbidea',
    profile_number: 'Zenbakia',
    profile_stair: 'Eskailera',
    profile_floor: 'Solairua',
    profile_door: 'Atea',
    profile_current_password: 'Uneko Pasahitza',
    profile_new_password: 'Pasahitz Berria (gutxienez 6 karaktere)',
    profile_confirm_password: 'Berretsi Pasahitz Berria',
    profile_change_password_btn: 'Pasahitza Eguneratu',
    profile_save_changes_btn: 'Gorde Profilaren Datuak',
    profile_edit_btn: 'Editatu Profila',
    profile_not_specified: 'Zehaztu gabe',
    profile_full_address: 'Helbide osoa',

    role_buyer: 'Bezeroa / Eroslea',
    role_seller: 'Ekoizlea / Saltzailea',
    role_admin: 'Administratzailea',
    auth_email: 'Helbide elektronikoa',
    auth_password: 'Pasahitza',
    auth_full_name: 'Izen-abizenak edo Dendaren Izena',
    auth_phone: 'Telefonoa',
    auth_town: 'Herria / Hiria',
    auth_have_account: 'Dagoeneko kontua duzu? Hasi saioa',
    auth_no_account: 'Ez duzu konturik? Erregistratu hemen',

    legal_terms: 'Erabilera Baldintzak',
    legal_privacy: 'Pribatutasun Politika',
    legal_cookies: 'Cookien Politika',
    legal_notice: 'Lege Oharra',
    cookie_text: 'Gure webguneak cookieak erabiltzen ditu nabigazio esperientzia onena eskaintzeko.',
    cookie_accept: 'Onartu Guztiak',
    cookie_reject: 'Ukatu',
    cookie_settings: 'Konfiguratu',

    footer_club_title: 'Gazta Onaren Lagunen Kluba',
    footer_club_subtitle: 'EkhiTekako nobedadeetan eguneratuta egon nahi al duzu?',
    footer_club_desc: 'Denboraldiko gazta berriak, Lekeition egindako cata esklusiboak eta lote mugatuak.',
    footer_join_whatsapp: 'WhatsApp bidez sartu',
    footer_cheese_desc: 'Afilatutako gaztak, kantabriar gatzadurak eta eskuz hautatutako artisau kontserbak.',
    footer_delivery_desc: 'Hotz-katea bermatuta 24/48 ordutan.',
    footer_pickup_desc: 'Eskatu online eta jaso prestatuta gure Lekeitioko gaztaterian.',
    footer_categories: 'Kategoriak',
    footer_experiences: 'Esperientziak',
    footer_legal: 'Informazio Legala',
    footer_schedule_title: 'Dendaren Ordutegia:',
    footer_schedule_weekdays: 'Al-Os: 10:00 - 14:30 | 17:00 - 20:30',
    footer_schedule_saturday: 'Larunbatak: 10:30 - 15:00',
    footer_copyright: 'Eskubide guztiak erreserbatuak.',
    footer_tagline: 'Artisau inspirazioa & km0 afinatzea · Lekeitio',
    footer_exp_tasting: 'Cata presentzialak Lekeition',
    footer_exp_weddings: 'Ezkontzarako gazta-mahaiak',
    footer_exp_gifts: 'Saskiak eta Opari Gourmetak',
    footer_exp_consult: 'Kontsultak Gazta Maisuarekin',

    common_save: 'Gorde',
    common_cancel: 'Utzi',
    common_delete: 'Ezabatu',
    common_edit: 'Editatu',
    common_back: 'Itzuli',
    common_loading: 'Kargatzen...',
    common_success: 'Eragiketa ondo burutu da',
    common_error: 'Errorea gertatu da',
    common_theme_light: 'Argia',
    common_theme_dark: 'Iluna',
    common_theme_system: 'Sistema',
    common_select_language: 'Hizkuntza hautatu',
  },

  es: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Tienda Gourmet & Productos Artesanos',
    brand_subtitle: 'Quesos de autor, bonito del norte, salazones, gildas, cerveza artesanal, txakoli y sidra selecta.',
    top_refrigerated_shipping: 'Envío refrigerado 24/48h en península',
    top_custom_orders: 'Encargos a medida y asesoramiento gourmet',
    top_store_pickup: 'Recogida gratuita en tienda',

    nav_shop: 'Tienda',
    nav_cart: 'Cesta',
    nav_orders: 'Pedidos',
    nav_my_products: 'Mis Productos',
    nav_chats: 'Mensajes',
    nav_admin: 'Admin',
    nav_login: 'Iniciar Sesión',
    nav_register: 'Registrarse',
    nav_profile: 'Perfil',
    nav_logout: 'Cerrar Sesión',
    nav_gourmet_gifts: 'Regalos Gourmet',
    nav_gourmet_gifts_line1: 'Regalos',
    nav_gourmet_gifts_line2: 'Gourmet',
    nav_tastings_experiences: 'Catas & Experiencias',
    nav_tastings_line1: 'Catas &',
    nav_tastings_line2: 'Experiencias',
    nav_corporate_gifts: 'Regalos de Empresa',
    nav_corporate_line1: 'Regalos de',
    nav_corporate_line2: 'Empresa',
    nav_events: 'Eventos',
    nav_add_product: 'Añadir Producto',
    nav_add_product_line1: 'Añadir',
    nav_add_product_line2: 'Producto',
    nav_explore_selection: 'Explorar Selección',
    nav_your_account: 'Tu Cuenta',

    cat_all: 'Todos',
    cat_queso: 'Queso',
    cat_atun: 'Atún y Bonito',
    cat_salazon: 'Salazón y Anchoas',
    cat_jildas: 'Gildas y Encurtidos',
    cat_cerveza: 'Cerveza artesanal',
    cat_txakoli: 'Txakoli',
    cat_sidra: 'Sidra',
    cat_new_badge: 'Novedad',
    cat_explore: 'Explorar sección',
    cat_section_title: 'Categorías Selección EkhiTeka',
    sub_quesos: 'Artesanos & Afinados',
    sub_atun: 'Cantábrico Costera',
    sub_salazones: 'Anchoas & Salazón',
    sub_gildas: 'Gildas & Encurtidos',
    sub_cerveza: 'Craft & Especiales',
    sub_txakoli: 'Bizkaiko Txakolina',
    sub_sidra: 'Euskal Sagardoa',
    sub_cesta: 'Cestas de Regalo',
    sub_catas: 'Catas & Talleres',
    sub_default: 'Selección Gourmet',

    prod_price: 'Precio',
    prod_unit: 'ud',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'botella',
    prod_can: 'lata',
    prod_jar: 'tarro',
    prod_origin: 'Origen',
    prod_stock: 'Stock',
    prod_unlimited: 'Ilimitado',
    prod_add_to_cart: 'Añadir a la cesta',
    prod_added: 'Añadido',
    prod_ask_artisan: 'Preguntar al artesano',
    prod_consult_product: 'Consulta sobre este producto',
    prod_details: 'Detalles',
    prod_search_placeholder: 'Buscar quesos, bonito, gildas, txakoli...',
    prod_no_results: 'No se encontraron productos',
    prod_sort_by: 'Ordenar',
    prod_sort_name_asc: 'Nombre (A-Z)',
    prod_sort_name_desc: 'Nombre (Z-A)',
    prod_sort_price_asc: 'Precio (menor a mayor)',
    prod_sort_price_desc: 'Precio (mayor a menor)',
    prod_showing: 'productos disponibles',
    prod_sold_out: 'Agotado',
    prod_last_units: '¡Últimas unidades!',
    prod_available: 'Disponible',
    prod_availability: 'Disponibilidad:',
    prod_format_label: 'Formato',
    prod_weight_label: 'Peso',
    prod_price_per_seat: '/ plaza',
    prod_vat_included: 'IVA incl.',
    prod_doubt_title: '¿Tienes alguna duda sobre este producto?',
    prod_doubt_desc: 'Consulta directamente con nuestros afinadores y expertos.',
    prod_ask_btn: 'Preguntar',
    prod_guarantee_cold: 'Frío garantizado 24/48h',
    prod_guarantee_pickup: 'Recogida en Lekeitio',
    prod_guarantee_km0: 'Calidad artesanal km0',
    prod_related_subtitle: 'Recomendaciones del afinador',
    prod_related_title: 'También te puede interesar',
    prod_back_to_selection: 'Volver a la selección',

    event_seats: 'plazas',
    event_seat: 'plaza',
    event_seats_available: 'plazas disponibles',
    event_capacity_full: 'Aforo Completo (Sin Plazas)',
    event_last_seats: '¡Últimas plazas!',
    event_reserve_seat: 'Reservar Plaza(s)',
    event_seats_added: 'Plaza(s) Añadida(s)',
    event_upcoming_title: 'Próximos Eventos de Catas Presenciales',
    event_upcoming_subtitle: 'Plazas limitadas · Lekeitio Centro',
    event_catalog_title: 'Catas & Experiencias Disponibles',
    event_catalog_subtitle: 'Catas en tienda & Kits para casa',
    event_home_catalog_title: 'Kits de Catas en Casa Disponibles',
    event_home_catalog_subtitle: 'Kits & Packs para llevar',
    event_store_catalog_title: 'Catas en Tienda Disponibles',
    event_store_catalog_subtitle: 'Presencial en Lekeitio',

    home_hero_badge: 'Quesería Gourmet & Espacio Gastronómico',
    home_hero_title: 'Quesos de autor & Experiencias en Lekeitio',
    home_hero_subtitle: 'Quesos de autor & Experiencias en Lekeitio',
    home_hero_desc: 'Afinado artesanal de quesos singulares, tesoros del Cantábrico y maridajes selectos.',
    home_explore_btn: 'Explorar Tienda Online',
    home_gourmet_gifts_btn: 'Regalos Gourmet',
    home_pillars_badge: 'Nuestra Casa · El Universo EkhiTeka',
    home_pillars_title: 'Descubre Nuestras Secciones',
    home_pillars_desc: 'Selecciona la experiencia que buscas y déjate guiar por nuestro afinado artesanal.',
    home_card1_badge: 'Online & Envío',
    home_card1_sub: 'Catálogo Completo',
    home_card1_title: 'Tienda Gourmet',
    home_card1_desc: 'Quesos afinados, bonito del Cantábrico, salazones, gildas artesanas, txakoli, sidra y cerveza de autor.',
    home_card1_btn: 'Entrar a la Tienda',
    home_card2_badge: 'Para Regalar',
    home_card2_sub: 'Detalles & Cestas',
    home_card2_title: 'Regalos Gourmet',
    home_card2_desc: 'Cestas gourmet personalizadas, kits de cata para casa y tarjetas regalo virtuales o físicas.',
    home_card2_btn: 'Ver Opciones de Regalo',
    home_card3_badge: 'Sensorial',
    home_card3_sub: 'En Tienda & Eventos',
    home_card3_title: 'Catas & Experiencias',
    home_card3_desc: 'Catas en casa, catas presenciales en tienda de Lekeitio, mesas para bodas y préstamo de raclette.',
    home_card3_btn: 'Descubrir Experiencias',
    home_card4_badge: 'Corporativo',
    home_card4_sub: 'Equipos & Clientes',
    home_card4_title: 'Regalos de Empresa',
    home_card4_desc: 'Teambuilding gastronómico, cestas de navidad de autor y detalles corporativos a medida.',
    home_card4_btn: 'Ver Servicios de Empresa',

    exp_banner_badge: 'Aquí pasan cosas...',
    exp_banner_title: 'Catas, Eventos & Experiencias EkhiTeka',
    exp_b1_title: 'Catas Presenciales & Talleres',
    exp_b1_desc: 'Aprende a degustar quesos artesanales en Lekeitio.',
    exp_b1_btn: 'Consultar Próximas Fechas',
    exp_b2_title: 'Mesas de Quesos para Bodas & Fiestas',
    exp_b2_desc: 'Montamos impresionantes Cheese Corners personalizados.',
    exp_b2_btn: 'Pedir Presupuesto Evento',
    exp_b3_title: 'Cestas Gourmet & Regalos de Empresa',
    exp_b3_desc: 'Diseñamos cajas gastronómicas exclusivas con embalaje premium.',
    exp_b3_btn: 'Configurar Cesta a Medida',

    exp_hero_badge: 'Experiencias Gastronómicas',
    exp_hero_title: 'Catas &',
    exp_hero_title_highlight: 'Experiencias',
    exp_hero_desc: 'Descubre el arte del queso artesano a través de nuestras catas guiadas.',
    exp_home_tasting_title: 'Catas en Casa',
    exp_home_tasting_badge: 'A tu ritmo',
    exp_home_tasting_desc: 'Conviértete en anfitrión con nuestros kits completos de cata.',
    exp_home_tasting_btn: 'Solicitar Kit para Casa',
    exp_store_tasting_title: 'Catas en la Tienda',
    exp_store_tasting_badge: 'Presencial en Lekeitio',
    exp_store_tasting_desc: 'Experiencias presenciales exclusivas en nuestra quesería de Lekeitio.',
    exp_store_tasting_btn: 'Ver Fechas & Reservar Plaza',
    exp_wedding_title: 'Mesa para Bodas',
    exp_wedding_badge: 'Bodas & Eventos',
    exp_wedding_desc: 'Creamos mesas de quesos espectaculares para cócteles y bodas.',
    exp_wedding_btn: 'Pedir Presupuesto para Bodas',
    exp_raclette_title: 'Préstamo de Raclette',
    exp_raclette_badge: 'Alquiler & Pack',
    exp_raclette_desc: 'Te prestamos la máquina profesional de raclette tradicional suiza.',
    exp_raclette_btn: 'Consultar Disponibilidad de Raclette',

    gifts_hero_badge: 'Selección Exclusiva para Regalar',
    gifts_hero_title: 'Regalos',
    gifts_hero_title_highlight: 'Gourmet',
    gifts_hero_desc: 'Sorprende con cestas artesanales a medida y estuches de quesos afinados.',
    gifts_whatsapp_btn: 'Encargo Personalizado por WhatsApp',
    gifts_card1_title: 'Cestas Gourmet a Medida',
    gifts_card1_desc: 'Diseñamos cestas artesanales personalizadas.',
    gifts_card1_feature: 'Envío refrigerado con tarjeta dedicatoria',
    gifts_card2_title: 'Packs Degustación & Maridaje',
    gifts_card2_desc: 'Estuches temáticos preparados para abrir y disfrutar.',
    gifts_card2_feature: 'Presentación en caja prémium de madera',
    gifts_card3_title: 'Tarjetas & Catas de Regalo',
    gifts_card3_desc: 'El obsequio perfecto para que elijan sus quesos preferidos.',
    gifts_card3_feature: 'Válido online y en tienda física',
    gifts_catalog_badge: 'Disponibles para envío o recogida',
    gifts_catalog_title: 'Cestas & Packs Listos para Regalar',

    corp_hero_badge: 'Soluciones Corporativas',
    corp_hero_title: 'Regalos de',
    corp_hero_title_highlight: 'Empresa',
    corp_hero_desc: 'Agradece la confianza de tu equipo con lotes gastronómicos artesanos.',
    corp_whatsapp_btn: 'Pedir Presupuesto Corporativo por WhatsApp',
    corp_card1_title: 'Lotes y Cestas de Navidad',
    corp_card1_desc: 'Composiciones prémium sin intermediarios.',
    corp_card2_title: 'Catas Privadas & Team Building',
    corp_card2_desc: 'Organizamos eventos de empresa y actividades guiadas.',
    corp_card3_title: 'Personalización con tu Marca',
    corp_card3_desc: 'Incluimos fajas y tarjetas con el logotipo de tu empresa.',
    corp_logistics_badge: 'Compromiso EkhiTeka',
    corp_logistics_title: 'Logística Impecable',
    corp_logistics_desc: 'Envíos a múltiples domicilios en 24/48 horas con trazabilidad total.',
    corp_logistics_feat1: 'Envíos individuales a cada empleado',
    corp_logistics_feat2: 'Transporte refrigerado homologado',
    corp_logistics_feat3: 'Facturación detallada con IVA desglosado',

    reviews_badge: 'Confianza & Pasión Gastronómica',
    reviews_title: 'Opiniones de Nuestros Clientes',
    reviews_subtitle: 'Lo que dicen los amantes del buen queso que ya han probado nuestra selección',
    reviews_verified_buyer: 'Comprador verificado',
    rev1_comment: 'Los quesos son una auténtica locura. El afinado perfecto y el envío refrigerado llegó impecable en 24h.',
    rev1_date: 'Hace 3 días',
    rev2_comment: 'Encargué una tabla de quesos y todos los invitados quedaron fascinados.',
    rev2_date: 'Hace 1 semana',
    rev3_comment: 'Compro la selección de quesos y anchoas todos los meses. El empaquetado térmico mantiene el producto fresco.',
    rev3_date: 'Hace 2 semanas',

    cart_title: 'Tu Cesta',
    cart_empty: 'Tu cesta está vacía',
    cart_empty_sub: 'Explora nuestra selección gourmet y añade tus productos preferidos.',
    cart_explore_btn: 'Explorar Tienda',
    cart_subtotal: 'Subtotal',
    cart_total: 'Total',
    cart_checkout: 'Tramitar Pedido',
    cart_remove: 'Eliminar',
    cart_quantity: 'Cantidad',
    cart_continue_shopping: 'Seguir Comprando',
    deliv_choose_mode: 'Elige cómo recibir tu pedido',
    deliv_home: 'Envío a domicilio',
    deliv_home_desc: 'Transporte refrigerado en tu puerta en 24-48 horas',
    deliv_store_pickup: 'Recogida en tienda',
    deliv_store_pickup_desc: 'Pasa a recoger tu pedido preparado en nuestro local',
    deliv_shipping_address: 'Dirección de entrega',
    deliv_shipping_notes: 'Notas de entrega',
    deliv_pickup_time: 'Hora aproximada de recogida',
    deliv_pickup_address: 'Dirección de la tienda: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirmar y Realizar Pedido',
    deliv_order_success: '¡Pedido realizado con éxito!',
    deliv_order_success_desc: 'El artesano ha recibido tu pedido y comenzará a prepararlo.',
    deliv_store_pickup_tag: 'Recogida en Tienda Lekeitio',
    deliv_home_tag: 'Envío a domicilio',

    orders_title: 'Mis Pedidos',
    orders_title_seller: 'Gestión de Pedidos',
    orders_subtitle_buyer: 'Seguimiento y estado de tus compras gourmet.',
    orders_subtitle_seller: 'Gestiona pedidos de clientes y actualiza estados.',
    orders_status: 'Estado',
    orders_pending: 'Por validar',
    orders_confirmed: 'Validado',
    orders_preparing: 'En preparación',
    orders_ready_delivery: 'Listo para entrega',
    orders_delivered: 'Entregado',
    orders_cancelled: 'Cancelado',
    orders_change_status: 'Cambiar estado',
    orders_cancel_order: 'Cancelar pedido',
    orders_cancel_reason: 'Motivo de cancelación',
    orders_chat_with_buyer: 'Chat con el cliente',
    orders_chat_with_seller: 'Chat con el artesano',
    orders_no_orders: 'No tienes pedidos aún',
    orders_no_orders_seller: 'No hay pedidos recibidos todavía',
    orders_no_orders_seller_sub: 'Los nuevos pedidos aparecerán aquí automáticamente.',
    orders_products_label: 'Productos del Pedido',
    orders_products_to_prepare: 'Productos a Preparar',
    orders_purchase_date: 'Fecha de Compra',
    orders_date_time: 'Fecha y Hora',
    orders_order_number: 'Pedido:',
    orders_total_to_charge: 'Total a cobrar:',
    orders_new_status: '¡Novedad! El estado de tu pedido ha cambiado a:',
    orders_mark_seen: 'Marcar como Visto',
    orders_client_label: 'Cliente',
    orders_qty_label: 'Cantidad',

    status_confirm: 'Confirmar',
    status_preparing: 'Preparando',
    status_ready: 'Listo Entrega',
    status_delivered: 'Entregado',

    // Perfil
    profile_title: 'Mi Perfil',
    profile_subtitle: 'Gestiona tus datos personales, dirección de entrega y seguridad.',
    profile_personal_data: 'Datos Personales',
    profile_address_data: 'Dirección de Entrega y Contacto',
    profile_security: 'Seguridad y Cambio de Contraseña',
    profile_first_name: 'Nombre',
    profile_last_name_1: 'Primer Apellido',
    profile_last_name_2: 'Segundo Apellido',
    profile_birth_date: 'Fecha de Nacimiento',
    profile_dni: 'DNI / NIE',
    profile_phone: 'Teléfono Móvil',
    profile_province: 'Provincia',
    profile_town: 'Municipio / Ciudad',
    profile_postal_code: 'Código Postal',
    profile_street: 'Calle / Dirección',
    profile_number: 'Nº',
    profile_stair: 'Escalera',
    profile_floor: 'Piso',
    profile_door: 'Puerta',
    profile_current_password: 'Contraseña Actual',
    profile_new_password: 'Nueva Contraseña (mínimo 6 caracteres)',
    profile_confirm_password: 'Confirmar Nueva Contraseña',
    profile_change_password_btn: 'Actualizar Contraseña',
    profile_save_changes_btn: 'Guardar Datos del Perfil',
    profile_edit_btn: 'Editar Perfil',
    profile_not_specified: 'No especificado',
    profile_full_address: 'Dirección completa',

    role_buyer: 'Comprador / Gourmet',
    role_seller: 'Productor / Vendedor',
    role_admin: 'Administrador',
    auth_email: 'Correo electrónico',
    auth_password: 'Contraseña',
    auth_full_name: 'Nombre completo o Nombre de la Tienda',
    auth_phone: 'Teléfono de contacto',
    auth_town: 'Localidad / Ciudad',
    auth_have_account: '¿Ya tienes cuenta? Inicia sesión',
    auth_no_account: '¿No tienes cuenta? Regístrate aquí',

    legal_terms: 'Términos de Uso',
    legal_privacy: 'Política de Privacidad',
    legal_cookies: 'Política de Cookies',
    legal_notice: 'Aviso Legal',
    cookie_text: 'Utilizamos cookies para garantizar la mejor experiencia gastronómica.',
    cookie_accept: 'Aceptar Todas',
    cookie_reject: 'Rechazar',
    cookie_settings: 'Configurar',

    footer_club_title: 'Club de Amigos del Buen Queso',
    footer_club_subtitle: '¿Quieres estar al día de las novedades de EkhiTeka?',
    footer_club_desc: 'Nuevas llegadas de quesos de temporada y catas exclusivas.',
    footer_join_whatsapp: 'Unirme por WhatsApp',
    footer_cheese_desc: 'Quesos afinados y salazones del cantábrico.',
    footer_delivery_desc: 'Cadena de frío garantizada 24/48 horas.',
    footer_pickup_desc: 'Haz tu pedido online y recógelo preparado sin esperas.',
    footer_categories: 'Categorías',
    footer_experiences: 'Experiencias',
    footer_legal: 'Información Legal',
    footer_schedule_title: 'Horario de Tienda:',
    footer_schedule_weekdays: 'Lun-Vie: 10:00 - 14:30 | 17:00 - 20:30',
    footer_schedule_saturday: 'Sábados: 10:30 - 15:00',
    footer_copyright: 'Todos los derechos reservados.',
    footer_tagline: 'Inspiración artesana & afinado km0 · Lekeitio',
    footer_exp_tasting: 'Catas Presenciales Lekeitio',
    footer_exp_weddings: 'Mesas de Queso para Bodas',
    footer_exp_gifts: 'Cestas y Regalos Gourmet',
    footer_exp_consult: 'Consultas con el Maestro Quesero',

    common_save: 'Guardar',
    common_cancel: 'Cancelar',
    common_delete: 'Eliminar',
    common_edit: 'Editar',
    common_back: 'Volver',
    common_loading: 'Cargando...',
    common_success: 'Acción completada con éxito',
    common_error: 'Ha ocurrido un error',
    common_theme_light: 'Claro',
    common_theme_dark: 'Oscuro',
    common_theme_system: 'Auto',
    common_select_language: 'Seleccionar Idioma',
  },

  en: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Gourmet Store & Artisan Delicacies',
    brand_subtitle: 'Artisan cheeses, white tuna, salted anchovies, gildas, craft beer, txakoli wine and Basque cider.',
    top_refrigerated_shipping: 'Refrigerated 24/48h shipping in mainland',
    top_custom_orders: 'Custom gourmet gifts & expert advice',
    top_store_pickup: 'Free in-store pickup',

    nav_shop: 'Shop',
    nav_cart: 'Cart',
    nav_orders: 'Orders',
    nav_my_products: 'My Products',
    nav_chats: 'Messages',
    nav_admin: 'Admin',
    nav_login: 'Sign In',
    nav_register: 'Sign Up',
    nav_profile: 'Profile',
    nav_logout: 'Log Out',
    nav_gourmet_gifts: 'Gourmet Gifts',
    nav_gourmet_gifts_line1: 'Gourmet',
    nav_gourmet_gifts_line2: 'Gifts',
    nav_tastings_experiences: 'Tastings & Experiences',
    nav_tastings_line1: 'Tastings &',
    nav_tastings_line2: 'Experiences',
    nav_corporate_gifts: 'Corporate Gifts',
    nav_corporate_line1: 'Corporate',
    nav_corporate_line2: 'Gifts',
    nav_events: 'Events',
    nav_add_product: 'Add Product',
    nav_add_product_line1: 'Add',
    nav_add_product_line2: 'Product',
    nav_explore_selection: 'Explore Selection',
    nav_your_account: 'Your Account',

    cat_all: 'All',
    cat_queso: 'Cheese',
    cat_atun: 'White Tuna',
    cat_salazon: 'Salted Fish',
    cat_jildas: 'Gildas & Pickles',
    cat_cerveza: 'Craft Beer',
    cat_txakoli: 'Txakoli Wine',
    cat_sidra: 'Natural Cider',
    cat_new_badge: 'New',
    cat_explore: 'Explore category',
    cat_section_title: 'EkhiTeka Selection Categories',
    sub_quesos: 'Artisan & Aged',
    sub_atun: 'Cantabrian Tuna',
    sub_salazones: 'Anchovies & Salted Fish',
    sub_gildas: 'Gildas & Pickles',
    sub_cerveza: 'Craft & Specials',
    sub_txakoli: 'Bizkaiko Txakolina',
    sub_sidra: 'Basque Cider',
    sub_cesta: 'Gift Hampers',
    sub_catas: 'Tastings & Workshops',
    sub_default: 'Gourmet Selection',

    prod_price: 'Price',
    prod_unit: 'unit',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'bottle',
    prod_can: 'can',
    prod_jar: 'jar',
    prod_origin: 'Origin',
    prod_stock: 'Stock',
    prod_unlimited: 'Unlimited',
    prod_add_to_cart: 'Add to Cart',
    prod_added: 'Added',
    prod_ask_artisan: 'Ask Artisan',
    prod_consult_product: 'Inquiry about this item',
    prod_details: 'Details',
    prod_search_placeholder: 'Search cheeses, tuna, wine, beer...',
    prod_no_results: 'No products found',
    prod_sort_by: 'Sort by',
    prod_sort_name_asc: 'Name (A-Z)',
    prod_sort_name_desc: 'Name (Z-A)',
    prod_sort_price_asc: 'Price (Lowest first)',
    prod_sort_price_desc: 'Price (Highest first)',
    prod_showing: 'products available',
    prod_sold_out: 'Sold Out',
    prod_last_units: 'Last units available!',
    prod_available: 'Available',
    prod_availability: 'Availability:',
    prod_format_label: 'Format',
    prod_weight_label: 'Weight',
    prod_price_per_seat: '/ seat',
    prod_vat_included: 'VAT included',
    prod_doubt_title: 'Do you have questions about this product?',
    prod_doubt_desc: 'Ask directly our master cheesemongers and experts.',
    prod_ask_btn: 'Ask',
    prod_guarantee_cold: 'Cold chain 24/48h',
    prod_guarantee_pickup: 'Pickup in Lekeitio',
    prod_guarantee_km0: 'Artisan km0 quality',
    prod_related_subtitle: 'Cheesemonger Recommendations',
    prod_related_title: 'You Might Also Like',
    prod_back_to_selection: 'Back to selection',

    event_seats: 'seats',
    event_seat: 'seat',
    event_seats_available: 'seats available',
    event_capacity_full: 'Full Capacity (Sold Out)',
    event_last_seats: 'Last seats available!',
    event_reserve_seat: 'Book Seat(s)',
    event_seats_added: 'Seat(s) Added',
    event_upcoming_title: 'Upcoming In-Person Tastings',
    event_upcoming_subtitle: 'Limited seats · Central Lekeitio',
    event_catalog_title: 'Available Tastings & Experiences',
    event_catalog_subtitle: 'In-store tastings & kits for home',
    event_home_catalog_title: 'Home Tasting Kits Available',
    event_home_catalog_subtitle: 'Kits & Tasting packs to take home',
    event_store_catalog_title: 'In-Store Tastings Available',
    event_store_catalog_subtitle: 'In-person in Lekeitio',

    home_hero_badge: 'Gourmet Cheesemonger & Gastro Space',
    home_hero_title: 'Author Cheeses & Experiences in Lekeitio',
    home_hero_subtitle: 'Author Cheeses & Experiences in Lekeitio',
    home_hero_desc: 'Artisan cheese ageing, Cantabrian treasures and curated pairings.',
    home_explore_btn: 'Explore Online Shop',
    home_gourmet_gifts_btn: 'Gourmet Gifts',
    home_pillars_badge: 'Our House · EkhiTeka Universe',
    home_pillars_title: 'Discover Our Sections',
    home_pillars_desc: 'Choose your preferred experience and let our artisan ageing guide you.',
    home_card1_badge: 'Online & Shipping',
    home_card1_sub: 'Full Catalogue',
    home_card1_title: 'Gourmet Shop',
    home_card1_desc: 'Aged cheeses, Cantabrian white tuna, salted anchovies, artisan gildas, txakoli and cider.',
    home_card1_btn: 'Enter Shop',
    home_card2_badge: 'For Gifting',
    home_card2_sub: 'Gifts & Hampers',
    home_card2_title: 'Gourmet Gifts',
    home_card2_desc: 'Bespoke gourmet hampers, home tasting kits and virtual or physical gift cards.',
    home_card2_btn: 'View Gift Options',
    home_card3_badge: 'Sensory',
    home_card3_sub: 'In-Store & Events',
    home_card3_title: 'Tastings & Experiences',
    home_card3_desc: 'Home tasting kits, in-person tastings in Lekeitio, wedding tables and raclette machine rental.',
    home_card3_btn: 'Discover Experiences',
    home_card4_badge: 'Corporate',
    home_card4_sub: 'Teams & Clients',
    home_card4_title: 'Corporate Gifts',
    home_card4_desc: 'Gourmet team-building, artisan Christmas hampers and corporate delicacies.',
    home_card4_btn: 'View Corporate Services',

    exp_banner_badge: 'Things happen here...',
    exp_banner_title: 'Tastings, Events & EkhiTeka Experiences',
    exp_b1_title: 'In-Person Tastings & Workshops',
    exp_b1_desc: 'Learn how to taste local and international artisan cheeses.',
    exp_b1_btn: 'Check Upcoming Dates',
    exp_b2_title: 'Cheese Boards for Weddings & Parties',
    exp_b2_desc: 'We set up impressive bespoke Cheese Corners.',
    exp_b2_btn: 'Request Event Quote',
    exp_b3_title: 'Gourmet Hampers & Corporate Gifts',
    exp_b3_desc: 'Exclusive gastronomic boxes with premium packaging.',
    exp_b3_btn: 'Configure Custom Hamper',

    exp_hero_badge: 'Gourmet Experiences',
    exp_hero_title: 'Tastings &',
    exp_hero_title_highlight: 'Experiences',
    exp_hero_desc: 'Discover the craft of artisan cheese through our guided tastings.',
    exp_home_tasting_title: 'Tastings at Home',
    exp_home_tasting_badge: 'At your own pace',
    exp_home_tasting_desc: 'Host your own tasting with our complete kits.',
    exp_home_tasting_btn: 'Order Home Tasting Kit',
    exp_store_tasting_title: 'In-Store Tastings',
    exp_store_tasting_badge: 'In-person in Lekeitio',
    exp_store_tasting_desc: 'Exclusive in-person experiences in our Lekeitio cheesemonger.',
    exp_store_tasting_btn: 'View Dates & Book Seat',
    exp_wedding_title: 'Wedding Cheese Tables',
    exp_wedding_badge: 'Weddings & Events',
    exp_wedding_desc: 'We design stunning cheese tables for wedding cocktails.',
    exp_wedding_btn: 'Request Wedding Quote',
    exp_raclette_title: 'Raclette Hire',
    exp_raclette_badge: 'Hire & Pack',
    exp_raclette_desc: 'We lend you the traditional Swiss raclette machine.',
    exp_raclette_btn: 'Check Raclette Availability',

    gifts_hero_badge: 'Exclusive Gifting Selection',
    gifts_hero_title: 'Gourmet',
    gifts_hero_title_highlight: 'Gifts',
    gifts_hero_desc: 'Surprise loved ones with bespoke artisan hampers.',
    gifts_whatsapp_btn: 'Custom Order via WhatsApp',
    gifts_card1_title: 'Bespoke Gourmet Hampers',
    gifts_card1_desc: 'We create custom hampers tailored to your budget.',
    gifts_card1_feature: 'Refrigerated delivery with custom gift note',
    gifts_card2_title: 'Tasting & Pairing Packs',
    gifts_card2_desc: 'Themed gift boxes ready to open and enjoy.',
    gifts_card2_feature: 'Delivered in a premium wooden box',
    gifts_card3_title: 'Gift Cards & Tasting Vouchers',
    gifts_card3_desc: 'The perfect gift so they can pick their favourite cheeses.',
    gifts_card3_feature: 'Valid online and in our store',
    gifts_catalog_badge: 'Available for delivery or pickup',
    gifts_catalog_title: 'Hampers & Packs Ready for Gifting',

    corp_hero_badge: 'Corporate Solutions',
    corp_hero_title: 'Corporate',
    corp_hero_title_highlight: 'Gifts',
    corp_hero_desc: 'Reward your team with artisan gastronomic packs.',
    corp_whatsapp_btn: 'Request Corporate Quote via WhatsApp',
    corp_card1_title: 'Christmas Hampers & Boxes',
    corp_card1_desc: 'Direct premium compositions.',
    corp_card2_title: 'Private Tastings & Team Building',
    corp_card2_desc: 'Corporate events in our Lekeitio shop or at your office.',
    corp_card3_title: 'Branding Customisation',
    corp_card3_desc: 'Custom sleeves and cards with your company logo.',
    corp_logistics_badge: 'EkhiTeka Commitment',
    corp_logistics_title: 'Flawless Logistics',
    corp_logistics_desc: 'Shipments to employee addresses in 24/48 hours.',
    corp_logistics_feat1: 'Individual shipping to each employee',
    corp_logistics_feat2: 'Certified refrigerated transport',
    corp_logistics_feat3: 'Itemised invoice with VAT breakdown',

    reviews_badge: 'Trust & Gastronomic Passion',
    reviews_title: 'What Our Customers Say',
    reviews_subtitle: 'Feedback from cheese lovers who have tasted our selection',
    reviews_verified_buyer: 'Verified Buyer',
    rev1_comment: 'The cheeses are absolutely incredible. Perfect ageing and refrigerated shipping arrived in 24h.',
    rev1_date: '3 days ago',
    rev2_comment: 'I ordered a cheese board and every guest was delighted.',
    rev2_date: '1 week ago',
    rev3_comment: 'I order every month. The thermal packaging keeps everything fresh.',
    rev3_date: '2 weeks ago',

    cart_title: 'Your Cart',
    cart_empty: 'Your cart is empty',
    cart_empty_sub: 'Explore our gourmet selection and add your favourite delicacies.',
    cart_explore_btn: 'Browse Shop',
    cart_subtotal: 'Subtotal',
    cart_total: 'Total',
    cart_checkout: 'Proceed to Checkout',
    cart_remove: 'Remove',
    cart_quantity: 'Quantity',
    cart_continue_shopping: 'Continue Shopping',
    deliv_choose_mode: 'Choose delivery method',
    deliv_home: 'Home Delivery',
    deliv_home_desc: 'Refrigerated delivery to your doorstep in 24-48 hours',
    deliv_store_pickup: 'Store Pickup',
    deliv_store_pickup_desc: 'Pick up your prepared order directly at our store',
    deliv_shipping_address: 'Shipping Address',
    deliv_shipping_notes: 'Delivery notes',
    deliv_pickup_time: 'Estimated pickup time',
    deliv_pickup_address: 'Store Address: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirm & Place Order',
    deliv_order_success: 'Order placed successfully!',
    deliv_order_success_desc: 'The artisan has received your order and is preparing it.',
    deliv_store_pickup_tag: 'Store Pickup in Lekeitio',
    deliv_home_tag: 'Home Delivery',

    orders_title: 'My Orders',
    orders_title_seller: 'Order Management',
    orders_subtitle_buyer: 'Track your purchases and status.',
    orders_subtitle_seller: 'Manage customer orders and update statuses.',
    orders_status: 'Status',
    orders_pending: 'Pending Validation',
    orders_confirmed: 'Confirmed',
    orders_preparing: 'Preparing',
    orders_ready_delivery: 'Ready for Delivery',
    orders_delivered: 'Delivered',
    orders_cancelled: 'Cancelled',
    orders_change_status: 'Change status',
    orders_cancel_order: 'Cancel order',
    orders_cancel_reason: 'Cancellation reason',
    orders_chat_with_buyer: 'Chat with Buyer',
    orders_chat_with_seller: 'Chat with Artisan',
    orders_no_orders: 'You have no orders yet',
    orders_no_orders_seller: 'No orders received yet',
    orders_no_orders_seller_sub: 'New customer orders will appear here automatically.',
    orders_products_label: 'Order Items',
    orders_products_to_prepare: 'Items to Prepare',
    orders_purchase_date: 'Purchase Date',
    orders_date_time: 'Date & Time',
    orders_order_number: 'Order:',
    orders_total_to_charge: 'Total to charge:',
    orders_new_status: 'Update! Your order status changed to:',
    orders_mark_seen: 'Mark as Seen',
    orders_client_label: 'Customer',
    orders_qty_label: 'Quantity',

    status_confirm: 'Confirm',
    status_preparing: 'Preparing',
    status_ready: 'Ready',
    status_delivered: 'Delivered',

    // Profile
    profile_title: 'My Profile',
    profile_subtitle: 'Manage your contact information, shipping address and password.',
    profile_personal_data: 'Personal Information',
    profile_address_data: 'Shipping Address & Contact',
    profile_security: 'Security & Change Password',
    profile_first_name: 'First Name',
    profile_last_name_1: 'First Surname',
    profile_last_name_2: 'Second Surname',
    profile_birth_date: 'Date of Birth',
    profile_dni: 'ID / Passport Number',
    profile_phone: 'Mobile Phone',
    profile_province: 'Province / State',
    profile_town: 'Town / City',
    profile_postal_code: 'Postal Code',
    profile_street: 'Street Address',
    profile_number: 'Number',
    profile_stair: 'Stair',
    profile_floor: 'Floor',
    profile_door: 'Door / Flat',
    profile_current_password: 'Current Password',
    profile_new_password: 'New Password (min. 6 characters)',
    profile_confirm_password: 'Confirm New Password',
    profile_change_password_btn: 'Update Password',
    profile_save_changes_btn: 'Save Profile Information',
    profile_edit_btn: 'Edit Profile',
    profile_not_specified: 'Not specified',
    profile_full_address: 'Full address',

    role_buyer: 'Buyer / Gourmet',
    role_seller: 'Artisan / Seller',
    role_admin: 'Administrator',
    auth_email: 'Email address',
    auth_password: 'Password',
    auth_full_name: 'Full Name / Store Name',
    auth_phone: 'Contact Phone',
    auth_town: 'City / Town',
    auth_have_account: 'Already have an account? Sign in',
    auth_no_account: "Don't have an account? Register here",

    legal_terms: 'Terms of Service',
    legal_privacy: 'Privacy Policy',
    legal_cookies: 'Cookie Policy',
    legal_notice: 'Legal Notice',
    cookie_text: 'We use cookies to ensure you get the best gourmet shopping experience.',
    cookie_accept: 'Accept All',
    cookie_reject: 'Decline',
    cookie_settings: 'Preferences',

    footer_club_title: 'Friends of Good Cheese Club',
    footer_club_subtitle: 'Want to stay up to date with EkhiTeka news?',
    footer_club_desc: 'Seasonal cheese arrivals and exclusive tastings.',
    footer_join_whatsapp: 'Join via WhatsApp',
    footer_cheese_desc: 'Aged artisan cheeses and Cantabrian salted fish.',
    footer_delivery_desc: 'Cold chain guaranteed 24/48 hours.',
    footer_pickup_desc: 'Order online and collect your prepared order in Lekeitio.',
    footer_categories: 'Categories',
    footer_experiences: 'Experiences',
    footer_legal: 'Legal Information',
    footer_schedule_title: 'Store Hours:',
    footer_schedule_weekdays: 'Mon-Fri: 10:00 - 14:30 | 17:00 - 20:30',
    footer_schedule_saturday: 'Saturdays: 10:30 - 15:00',
    footer_copyright: 'All rights reserved.',
    footer_tagline: 'Artisan inspiration & km0 ageing · Lekeitio',
    footer_exp_tasting: 'In-Person Tastings Lekeitio',
    footer_exp_weddings: 'Cheese Boards for Weddings',
    footer_exp_gifts: 'Gourmet Hampers & Gifts',
    footer_exp_consult: 'Consult the Master Cheesemonger',

    common_save: 'Save',
    common_cancel: 'Cancel',
    common_delete: 'Delete',
    common_edit: 'Edit',
    common_back: 'Back',
    common_loading: 'Loading...',
    common_success: 'Completed successfully',
    common_error: 'An error occurred',
    common_theme_light: 'Light',
    common_theme_dark: 'Dark',
    common_theme_system: 'Auto',
    common_select_language: 'Select Language',
  },

  fr: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Épicerie Fine & Produits Artisanaux',
    brand_subtitle: 'Fromages fermiers, thon blanc, salaisons, gildas, bière artisanale, vin txakoli et cidre basque.',
    top_refrigerated_shipping: 'Livraison réfrigérée 24/48h',
    top_custom_orders: 'Coffrets sur mesure et conseils d\\'experts',
    top_store_pickup: 'Retrait gratuit en boutique',

    nav_shop: 'Boutique',
    nav_cart: 'Panier',
    nav_orders: 'Commandes',
    nav_my_products: 'Mes Produits',
    nav_chats: 'Messages',
    nav_admin: 'Admin',
    nav_login: 'Connexion',
    nav_register: 'Inscription',
    nav_profile: 'Profil',
    nav_logout: 'Déconnexion',
    nav_gourmet_gifts: 'Cadeaux Gourmets',
    nav_gourmet_gifts_line1: 'Cadeaux',
    nav_gourmet_gifts_line2: 'Gourmets',
    nav_tastings_experiences: 'Dégustations & Expériences',
    nav_tastings_line1: 'Dégustations &',
    nav_tastings_line2: 'Expériences',
    nav_corporate_gifts: 'Cadeaux d\\'Entreprise',
    nav_corporate_line1: 'Cadeaux',
    nav_corporate_line2: 'd\\'Entreprise',
    nav_events: 'Événements',
    nav_add_product: 'Ajouter un Produit',
    nav_add_product_line1: 'Ajouter',
    nav_add_product_line2: 'Produit',
    nav_explore_selection: 'Explorer la Sélection',
    nav_your_account: 'Votre Compte',

    cat_all: 'Tous',
    cat_queso: 'Fromage',
    cat_atun: 'Thon blanc',
    cat_salazon: 'Salaisons',
    cat_jildas: 'Gildas & Condiments',
    cat_cerveza: 'Bière artisanale',
    cat_txakoli: 'Vin Txakoli',
    cat_sidra: 'Cidre naturel',
    cat_new_badge: 'Nouveau',
    cat_explore: 'Explorer la catégorie',
    cat_section_title: 'Catégories Sélection EkhiTeka',
    sub_quesos: 'Fermiers & Affinés',
    sub_atun: 'Thon Cantabrique',
    sub_salazones: 'Anchois & Salaisons',
    sub_gildas: 'Gildas & Condiments',
    sub_cerveza: 'Craft & Spéciales',
    sub_txakoli: 'Vin Txakoli Basque',
    sub_sidra: 'Cidre du Pays Basque',
    sub_cesta: 'Coffrets Cadeaux',
    sub_catas: 'Dégustations & Ateliers',
    sub_default: 'Sélection Gourmet',

    prod_price: 'Prix',
    prod_unit: 'pièce',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'bouteille',
    prod_can: 'boîte',
    prod_jar: 'bocal',
    prod_origin: 'Origine',
    prod_stock: 'Stock',
    prod_unlimited: 'Illimité',
    prod_add_to_cart: 'Ajouter au panier',
    prod_added: 'Ajouté',
    prod_ask_artisan: 'Contacter l\\'artisan',
    prod_consult_product: 'Question sur ce produit',
    prod_details: 'Détails',
    prod_search_placeholder: 'Rechercher fromages, thon, vins...',
    prod_no_results: 'Aucun produit trouvé',
    prod_sort_by: 'Trier par',
    prod_sort_name_asc: 'Nom (A-Z)',
    prod_sort_name_desc: 'Nom (Z-A)',
    prod_sort_price_asc: 'Prix (croissant)',
    prod_sort_price_desc: 'Prix (décroissant)',
    prod_showing: 'produits disponibles',
    prod_sold_out: 'Épuisé',
    prod_last_units: 'Dernières unités !',
    prod_available: 'Disponible',
    prod_availability: 'Disponibilité :',
    prod_format_label: 'Format',
    prod_weight_label: 'Poids',
    prod_price_per_seat: '/ place',
    prod_vat_included: 'TTC',
    prod_doubt_title: 'Une question sur ce produit ?',
    prod_doubt_desc: 'Consultez directement nos maîtres affineurs et experts.',
    prod_ask_btn: 'Demander',
    prod_guarantee_cold: 'Froid garanti 24/48h',
    prod_guarantee_pickup: 'Retrait à Lekeitio',
    prod_guarantee_km0: 'Qualité artisanale km0',
    prod_related_subtitle: 'Recommandations de l\\'affineur',
    prod_related_title: 'Vous pourriez aussi aimer',
    prod_back_to_selection: 'Retour à la sélection',

    event_seats: 'places',
    event_seat: 'place',
    event_seats_available: 'places disponibles',
    event_capacity_full: 'Complet (Plus de places)',
    event_last_seats: 'Dernières places !',
    event_reserve_seat: 'Réserver Place(s)',
    event_seats_added: 'Place(s) Ajoutée(s)',
    event_upcoming_title: 'Prochains Événements de Dégustation en Boutique',
    event_upcoming_subtitle: 'Places limitées · Centre de Lekeitio',
    event_catalog_title: 'Dégustations & Expériences Disponibles',
    event_catalog_subtitle: 'Dégustations en boutique et kits à emporter',
    event_home_catalog_title: 'Kits de Dégustation à Domicile',
    event_home_catalog_subtitle: 'Kits & Packs de dégustation à emporter',
    event_store_catalog_title: 'Dégustations en Boutique Disponibles',
    event_store_catalog_subtitle: 'En présentiel à Lekeitio',

    home_hero_badge: 'Fromagerie Fine & Espace Gourmand',
    home_hero_title: 'Fromages d\\'Auteur & Dégustations à Lekeitio',
    home_hero_subtitle: 'Fromages d\\'Auteur & Dégustations à Lekeitio',
    home_hero_desc: 'Affinage artisanal de fromages uniques et trésors du Cantabrique.',
    home_explore_btn: 'Explorer la Boutique',
    home_gourmet_gifts_btn: 'Cadeaux Gourmets',
    home_pillars_badge: 'Notre Maison · L\\'Univers EkhiTeka',
    home_pillars_title: 'Découvrez Nos Univers',
    home_pillars_desc: 'Choisissez l\\'expérience souhaitée.',
    home_card1_badge: 'En Ligne & Livraison',
    home_card1_sub: 'Catalogue Complet',
    home_card1_title: 'Boutique Fine',
    home_card1_desc: 'Fromages affinés, thon blanc, anchois, gildas artisanales, txakoli et cidre.',
    home_card1_btn: 'Entrer dans la Boutique',
    home_card2_badge: 'À Offrir',
    home_card2_sub: 'Coffrets & Paniers',
    home_card2_title: 'Cadeaux Gourmets',
    home_card2_desc: 'Paniers gourmets sur mesure et cartes cadeaux.',
    home_card2_btn: 'Voir les Idées Cadeaux',
    home_card3_badge: 'Sensoriel',
    home_card3_sub: 'En Boutique & Événements',
    home_card3_title: 'Dégustations & Ateliers',
    home_card3_desc: 'Kits à la maison et dégustations guidées en boutique à Lekeitio.',
    home_card3_btn: 'Découvrir les Expériences',
    home_card4_badge: 'Entreprises',
    home_card4_sub: 'Équipes & Clients',
    home_card4_title: 'Cadeaux d\\'Entreprise',
    home_card4_desc: 'Team building gourmand et coffrets de Noël artisanaux.',
    home_card4_btn: 'Voir les Offres Pro',

    exp_banner_badge: 'Ici il se passe des choses...',
    exp_banner_title: 'Dégustations, Événements & Expériences EkhiTeka',
    exp_b1_title: 'Dégustations Présentielles & Ateliers',
    exp_b1_desc: 'Apprenez à degustar des fromages fermiers à Lekeitio.',
    exp_b1_btn: 'Consulter les Prochaines Dates',
    exp_b2_title: 'Buffets Fromages de Mariage & Fêtes',
    exp_b2_desc: 'Nous créons des Cheese Corners personnalisés.',
    exp_b2_btn: 'Demander un Devis Événement',
    exp_b3_title: 'Paniers Gourmets & Cadeaux d\\'Entreprise',
    exp_b3_desc: 'Coffrets gastronomiques exclusifs avec emballage soigné.',
    exp_b3_btn: 'Composer un Panier sur Mesure',

    exp_hero_badge: 'Expériences Gastronomiques',
    exp_hero_title: 'Dégustations &',
    exp_hero_title_highlight: 'Expériences',
    exp_hero_desc: 'Découvrez l\\'art du fromage fermier à travers nos dégustations.',
    exp_home_tasting_title: 'Dégustations à la Maison',
    exp_home_tasting_badge: 'À votre rythme',
    exp_home_tasting_desc: 'Devenez l\\'hôte idéal grâce à nos kits complets.',
    exp_home_tasting_btn: 'Commander Kit à Domicile',
    exp_store_tasting_title: 'Dégustations en Boutique',
    exp_store_tasting_badge: 'En présentiel à Lekeitio',
    exp_store_tasting_desc: 'Expériences présentielles exclusives dans notre fromagerie.',
    exp_store_tasting_btn: 'Voir les Dates & Réserver',
    exp_wedding_title: 'Buffets Fromages de Mariage',
    exp_wedding_badge: 'Mariages & Événements',
    exp_wedding_desc: 'Nous créons des buffets de fromages spectaculaires.',
    exp_wedding_btn: 'Demander un Devis Mariage',
    exp_raclette_title: 'Prêt d\\'Appareil à Raclette',
    exp_raclette_badge: 'Location & Pack',
    exp_raclette_desc: 'Nous vous prêtons l\\'appareil traditionnel suisse professionnel.',
    exp_raclette_btn: 'Consulter la Disponibilité Raclette',

    gifts_hero_badge: 'Sélection Exclusive à Offrir',
    gifts_hero_title: 'Cadeaux',
    gifts_hero_title_highlight: 'Gourmets',
    gifts_hero_desc: 'Surprenez avec des paniers artisanaux sur mesure.',
    gifts_whatsapp_btn: 'Commande Sur Mesure sur WhatsApp',
    gifts_card1_title: 'Paniers Gourmets Sur Mesure',
    gifts_card1_desc: 'Nous composons des paniers selon votre budget.',
    gifts_card1_feature: 'Livraison réfrigérée avec carte personnalisée',
    gifts_card2_title: 'Coffrets Dégustation & Accords',
    gifts_card2_desc: 'Coffrets prêts à déguster avec confitures artisanales.',
    gifts_card2_feature: 'Présentation dans une boîte en bois prémium',
    gifts_card3_title: 'Cartes Cadeaux & Dégustations',
    gifts_card3_desc: 'Le cadeau parfait pour choisir leurs fromages préférés.',
    gifts_card3_feature: 'Valable en ligne et en boutique',
    gifts_catalog_badge: 'Disponibles pour livraison ou retrait',
    gifts_catalog_title: 'Paniers & Coffrets Prêts à Offrir',

    corp_hero_badge: 'Offres Entreprises',
    corp_hero_title: 'Cadeaux',
    corp_hero_title_highlight: 'd\\'Entreprise',
    corp_hero_desc: 'Remerciez vos équipes avec des paniers artisanaux.',
    corp_whatsapp_btn: 'Devis Entreprise par WhatsApp',
    corp_card1_title: 'Coffrets et Paniers de Noël',
    corp_card1_desc: 'Compositions sans intermédiaires avec facture détaillée.',
    corp_card2_title: 'Dégustations Privées & Team Building',
    corp_card2_desc: 'Événements d\\'équipe dans notre fromagerie à Lekeitio.',
    corp_card3_title: 'Personnalisation à Vos Couleurs',
    corp_card3_desc: 'Bandeaux personnalisés et logo de votre entreprise.',
    corp_logistics_badge: 'Engagement EkhiTeka',
    corp_logistics_title: 'Logistique Soignée',
    corp_logistics_desc: 'Expéditions vers les domiciles de vos collaborateurs en 24/48h.',
    corp_logistics_feat1: 'Envois individuels à chaque salarié',
    corp_logistics_feat2: 'Transport frigorifique certifié',
    corp_logistics_feat3: 'Facturation claire avec TVA détaillée',

    reviews_badge: 'Confiance & Passion Gastronomique',
    reviews_title: 'Avis de Nos Clients',
    reviews_subtitle: 'Ce que disent les amateurs de bon fromage',
    reviews_verified_buyer: 'Acheteur vérifié',
    rev1_comment: 'Les fromages sont extraordinaires. Affinage impeccable et colis frais reçu en 24h.',
    rev1_date: 'Il y a 3 jours',
    rev2_comment: 'J\\'ai commandé un plateau pour un anniversaire, les invités étaient conquis.',
    rev2_date: 'Il y a 1 semaine',
    rev3_comment: 'Je commande tous les mois. L\\'emballage thermique garde le produit très frais.',
    rev3_date: 'Il y a 2 semaines',

    cart_title: 'Votre Panier',
    cart_empty: 'Votre panier est vide',
    cart_empty_sub: 'Découvrez nos délices gourmets et composez votre sélection.',
    cart_explore_btn: 'Voir la boutique',
    cart_subtotal: 'Sous-total',
    cart_total: 'Total',
    cart_checkout: 'Valider la commande',
    cart_remove: 'Supprimer',
    cart_quantity: 'Quantité',
    cart_continue_shopping: 'Continuer les Achats',
    deliv_choose_mode: 'Mode de réception',
    deliv_home: 'Livraison à domicile',
    deliv_home_desc: 'Colis réfrigéré livré à votre porte en 24-48h',
    deliv_store_pickup: 'Retrait en boutique',
    deliv_store_pickup_desc: 'Récupérez votre commande prête dans notre magasin',
    deliv_shipping_address: 'Adresse de livraison',
    deliv_shipping_notes: 'Instructions de livraison',
    deliv_pickup_time: 'Heure de retrait estimée',
    deliv_pickup_address: 'Adresse boutique : Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirmer la commande',
    deliv_order_success: 'Commande validée avec succès !',
    deliv_order_success_desc: 'L\\'artisan a reçu votre commande et prépare vos produits.',
    deliv_store_pickup_tag: 'Retrait en boutique à Lekeitio',
    deliv_home_tag: 'Livraison à domicile',

    orders_title: 'Mes Commandes',
    orders_title_seller: 'Gestion des Commandes',
    orders_subtitle_buyer: 'Suivez vos achats et le statut de vos commandes.',
    orders_subtitle_seller: 'Gérez les commandes clients et mettez à jour les statuts.',
    orders_status: 'Statut',
    orders_pending: 'À valider',
    orders_confirmed: 'Validée',
    orders_preparing: 'En préparation',
    orders_ready_delivery: 'Prête pour livraison',
    orders_delivered: 'Livrée',
    orders_cancelled: 'Annulée',
    orders_change_status: 'Changer le statut',
    orders_cancel_order: 'Annuler la commande',
    orders_cancel_reason: 'Motif d\\'annulation',
    orders_chat_with_buyer: 'Chat avec le client',
    orders_chat_with_seller: 'Chat avec l\\'artisan',
    orders_no_orders: 'Vous n\\'avez aucune commande pour le moment',
    orders_no_orders_seller: 'Aucune commande reçue pour le moment',
    orders_no_orders_seller_sub: 'Les nouvelles commandes apparaîtront ici automatiquement.',
    orders_products_label: 'Articles de la commande',
    orders_products_to_prepare: 'Articles à préparer',
    orders_purchase_date: 'Date d\\'achat',
    orders_date_time: 'Date & Heure',
    orders_order_number: 'Commande :',
    orders_total_to_charge: 'Total à encaisser :',
    orders_new_status: 'Le statut de votre commande a changé :',
    orders_mark_seen: 'Marquer comme lu',
    orders_client_label: 'Client',
    orders_qty_label: 'Quantité',

    status_confirm: 'Confirmer',
    status_preparing: 'En préparation',
    status_ready: 'Prête',
    status_delivered: 'Livrée',

    // Profil
    profile_title: 'Mon Profil',
    profile_subtitle: 'Gérez vos données personnelles, adresse de livraison et sécurité.',
    profile_personal_data: 'Données Personnelles',
    profile_address_data: 'Adresse de Livraison & Contact',
    profile_security: 'Sécurité & Changer de Mot de Passe',
    profile_first_name: 'Prénom',
    profile_last_name_1: 'Premier Nom',
    profile_last_name_2: 'Deuxième Nom',
    profile_birth_date: 'Date de Naissance',
    profile_dni: 'Numéro d\\'Identité / Passeport',
    profile_phone: 'Téléphone Portable',
    profile_province: 'Province / Département',
    profile_town: 'Commune / Ville',
    profile_postal_code: 'Code Postal',
    profile_street: 'Adresse / Rue',
    profile_number: 'Numéro',
    profile_stair: 'Escalier',
    profile_floor: 'Étage',
    profile_door: 'Porte / Appartement',
    profile_current_password: 'Mot de Passe Actuel',
    profile_new_password: 'Nouveau Mot de Passe (min. 6 caractères)',
    profile_confirm_password: 'Confirmer le Nouveau Mot de Passe',
    profile_change_password_btn: 'Mettre à Jour le Mot de Passe',
    profile_save_changes_btn: 'Enregistrer les Informations du Profil',
    profile_edit_btn: 'Modifier le Profil',
    profile_not_specified: 'Non spécifié',
    profile_full_address: 'Adresse complète',

    role_buyer: 'Client / Gourmet',
    role_seller: 'Artisan / Vendeur',
    role_admin: 'Administrateur',
    auth_email: 'Adresse e-mail',
    auth_password: 'Mot de passe',
    auth_full_name: 'Nom complet ou Nom de la boutique',
    auth_phone: 'Téléphone de contact',
    auth_town: 'Ville / Commune',
    auth_have_account: 'Vous avez déjà un compte ? Connectez-vous',
    auth_no_account: 'Pas encore de compte ? Inscrivez-vous',

    legal_terms: 'Conditions Générales',
    legal_privacy: 'Politique de Confidentialité',
    legal_cookies: 'Politique de Cookies',
    legal_notice: 'Mentions Légales',
    cookie_text: 'Nous utilisons des cookies pour vous garantir la meilleure expérience.',
    cookie_accept: 'Tout Accepter',
    cookie_reject: 'Refuser',
    cookie_settings: 'Personnaliser',

    footer_club_title: 'Club des Amis du Bon Fromage',
    footer_club_subtitle: 'Vous souhaitez rester informé des actualités d\\'EkhiTeka ?',
    footer_club_desc: 'Nouvelles arrivées de fromages de saison et dégustations.',
    footer_join_whatsapp: 'Rejoindre par WhatsApp',
    footer_cheese_desc: 'Fromages affinés et salaisons du Cantabrique.',
    footer_delivery_desc: 'Chaîne du froid garantie 24/48h.',
    footer_pickup_desc: 'Commandez en ligne et récupérez votre commande à Lekeitio.',
    footer_categories: 'Catégories',
    footer_experiences: 'Expériences',
    footer_legal: 'Informations Légales',
    footer_schedule_title: 'Horaires boutique :',
    footer_schedule_weekdays: 'Lun-Ven : 10h00 - 14h30 | 17h00 - 20h30',
    footer_schedule_saturday: 'Samedis : 10h30 - 15h00',
    footer_copyright: 'Tous droits réservés.',
    footer_tagline: 'Inspiration artisanale & affinage km0 · Lekeitio',
    footer_exp_tasting: 'Dégustations en Présentiel Lekeitio',
    footer_exp_weddings: 'Plateaux de Fromages pour Mariages',
    footer_exp_gifts: 'Paniers et Cadeaux Gourmets',
    footer_exp_consult: 'Consultations avec le Maître Fromager',

    common_save: 'Enregistrer',
    common_cancel: 'Annuler',
    common_delete: 'Supprimer',
    common_edit: 'Modifier',
    common_back: 'Retour',
    common_loading: 'Chargement...',
    common_success: 'Opération réussie',
    common_error: 'Une erreur est survenue',
    common_theme_light: 'Clair',
    common_theme_dark: 'Sombre',
    common_theme_system: 'Auto',
    common_select_language: 'Choisir la langue',
  },
};
`,

  // =========================================================================
  // 2. PROFILE FORM (Vista con campos del bio + Modo Edición + Desplegable Contraseña)
  // =========================================================================
  'components/ProfileForm.tsx': `'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile, changeUserPassword } from '@/app/actions/auth';
import type { Profile } from '@/types/database';
import { parseProfile } from '@/types/database';
import {
  User,
  Phone,
  MapPin,
  Lock,
  Check,
  ShieldCheck,
  Home,
  Pencil,
  X,
  ChevronDown,
  Calendar,
  CreditCard,
} from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  userProfile?: Profile;
}

export function ProfileForm({ profile, userProfile }: ProfileFormProps) {
  const raw = profile || userProfile || ({} as Profile);
  const p = parseProfile(raw);
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoadingProfile(false);

    if (res?.error) {
      setProfileMsg({ text: res.error, isError: true });
    } else {
      setProfileMsg({ text: t.common_success, isError: false });
      setIsEditing(false);
      setTimeout(() => setProfileMsg(null), 3500);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await changeUserPassword(formData);
    setLoadingPassword(false);

    if (res?.error) {
      setPasswordMsg({ text: res.error, isError: true });
    } else {
      setPasswordMsg({ text: '¡Contraseña actualizada con éxito!', isError: false });
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setPasswordMsg(null);
        setIsPasswordOpen(false);
      }, 2500);
    }
  };

  const formattedAddress = [
    p.street,
    p.number ? \`Nº \${p.number}\` : '',
    p.stair ? \`Esc \${p.stair}\` : '',
    p.floor ? \`Piso \${p.floor}\` : '',
    p.door ? \`Pta \${p.door}\` : '',
    p.postal_code,
    p.town,
    p.province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-8 font-serif">
      {/* 1. TARJETA PRINCIPAL DE PERFIL */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#C68D07] dark:text-[#FFE259]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                {t.profile_personal_data}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {t.profile_subtitle}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer hover:scale-105"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{t.profile_edit_btn}</span>
            </button>
          )}
        </div>

        {profileMsg && (
          <div
            className={\`p-4 rounded-2xl text-xs font-bold text-center font-sans \${
              profileMsg.isError
                ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }\`}
          >
            {profileMsg.text}
          </div>
        )}

        {/* MODO VISTA: CADA DATO VISIBLE UNO A UNO */}
        {!isEditing ? (
          <div className="space-y-6 font-sans text-xs">
            {/* Bloque 1: Identificación y Contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_first_name} & {t.profile_last_name_1}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {[p.first_name, p.last_name_1, p.last_name_2].filter(Boolean).join(' ') || p.full_name || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_dni}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm uppercase">
                  {p.dni || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_birth_date}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.birth_date || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_phone}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.phone || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.auth_email}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.email || t.profile_not_specified}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                  {t.profile_town} · {t.profile_province}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {p.town || 'Lekeitio'} ({p.province || 'Bizkaia'})
                </p>
              </div>
            </div>

            {/* Bloque 2: Dirección Completa */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5 font-serif">
                <Home className="w-3.5 h-3.5" />
                <span>{t.profile_address_data}</span>
              </span>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {formattedAddress || t.profile_not_specified}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px] text-stone-500 dark:text-stone-400">
                <span><strong>{t.profile_street}:</strong> {p.street || '-'}</span>
                <span><strong>{t.profile_number}:</strong> {p.number || '-'}</span>
                <span><strong>{t.profile_floor}:</strong> {p.floor || '-'}</span>
                <span><strong>{t.profile_door}:</strong> {p.door || '-'}</span>
                <span><strong>{t.profile_postal_code}:</strong> {p.postal_code || '-'}</span>
              </div>
            </div>
          </div>
        ) : (
          /* MODO EDICIÓN: TODOS LOS CAMPOS EDITABLES */
          <form onSubmit={handleProfileSubmit} className="space-y-4 font-sans text-xs animate-fadeIn">
            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_first_name} *
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  defaultValue={p.first_name || ''}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_last_name_1} *
                </label>
                <input
                  type="text"
                  name="last_name_1"
                  required
                  defaultValue={p.last_name_1 || ''}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_last_name_2}
                </label>
                <input
                  type="text"
                  name="last_name_2"
                  defaultValue={p.last_name_2 || ''}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            {/* DNI, Fecha Nacimiento y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_dni} *
                </label>
                <input
                  type="text"
                  name="dni"
                  required
                  defaultValue={p.dni || ''}
                  placeholder="12345678Z"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl uppercase"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_birth_date} *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  required
                  defaultValue={p.birth_date || ''}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_phone} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={p.phone || ''}
                  placeholder="600 000 000"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            {/* Provincia, Municipio y Código Postal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_province} *
                </label>
                <input
                  type="text"
                  name="province"
                  required
                  defaultValue={p.province || 'Bizkaia'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_town} *
                </label>
                <input
                  type="text"
                  name="town"
                  required
                  defaultValue={p.town || 'Lekeitio'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_postal_code} *
                </label>
                <input
                  type="text"
                  name="postal_code"
                  required
                  defaultValue={p.postal_code || ''}
                  placeholder="48280"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            {/* Calle, Nº, Escalera, Piso y Puerta */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <div className="col-span-2 sm:col-span-2">
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_street} *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  defaultValue={p.street || ''}
                  placeholder="Gamarra Kalea"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_number} *
                </label>
                <input
                  type="text"
                  name="number"
                  required
                  defaultValue={p.number || ''}
                  placeholder="4"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_stair}
                </label>
                <input
                  type="text"
                  name="stair"
                  defaultValue={p.stair || ''}
                  placeholder="A"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_floor} *
                </label>
                <input
                  type="text"
                  name="floor"
                  required
                  defaultValue={p.floor || ''}
                  placeholder="2"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.profile_door} *
                </label>
                <input
                  type="text"
                  name="door"
                  required
                  defaultValue={p.door || ''}
                  placeholder="B"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {t.common_cancel}
              </button>
              <button
                type="submit"
                disabled={loadingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer font-serif disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{loadingProfile ? t.common_loading : t.profile_save_changes_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. TARJETA CAMBIAR CONTRASEÑA (Desplegable al pulsar) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
        <button
          type="button"
          onClick={() => setIsPasswordOpen(!isPasswordOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                {t.profile_security}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                {isPasswordOpen ? 'Introduce tu contraseña actual y la nueva clave de acceso.' : 'Pulsa aquí para desplegar el formulario y cambiar tu contraseña.'}
              </p>
            </div>
          </div>

          <div className={\`p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-transform duration-200 \${isPasswordOpen ? 'rotate-180' : ''}\`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {isPasswordOpen && (
          <form onSubmit={handlePasswordSubmit} className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 space-y-4 font-sans text-xs max-w-md animate-fadeIn">
            {passwordMsg && (
              <div
                className={\`p-3.5 rounded-2xl text-xs font-bold text-center \${
                  passwordMsg.isError
                    ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                }\`}
              >
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_current_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="current_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_new_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="new_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {t.profile_confirm_password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loadingPassword}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1D1D1B] dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer font-serif disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-[#FFE259] dark:text-[#1D1D1B]" />
                <span>{loadingPassword ? t.common_loading : t.profile_change_password_btn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
`,

  // =========================================================================
  // 3. PÁGINA PERFIL
  // =========================================================================
  'app/perfil/page.tsx': `import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/types/database';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userProfile = profile as Profile;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
            Mi Perfil · Nire Profila
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Gestiona tus datos personales, dirección de envío y contraseña.
          </p>
        </div>
      </div>

      <ProfileForm userProfile={userProfile} profile={userProfile} />
    </div>
  );
}
`,
};

// Generación en disco
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`✓ Actualizado correctamente: ${filePath}`);
});

console.log('\n🎉 ¡Perfil (lectura/edición y contraseña desplegable) completado!');