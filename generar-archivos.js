const fs = require('fs');
const path = require('path');

const files = {
  // 1. DICCIONARIO CENTRAL MULTI-IDIOMA
  'lib/i18n/translations.ts': `export type Language = 'eu' | 'es' | 'en' | 'fr';

export interface TranslationDict {
  brand_name: string;
  brand_tagline: string;
  brand_subtitle: string;
  top_refrigerated_shipping: string;
  top_custom_orders: string;
  top_store_pickup: string;

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
  nav_tastings_experiences: string;
  nav_corporate_gifts: string;
  nav_events: string;
  nav_add_product: string;

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
  prod_available: string;
  prod_availability: string;

  event_seats: string;
  event_seats_available: string;
  event_capacity_full: string;
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

  seller_new_product: string;
  seller_edit_product: string;
  seller_product_name: string;
  seller_product_desc: string;
  seller_product_price: string;
  seller_product_category: string;
  seller_product_format: string;
  seller_product_origin: string;
  seller_product_stock: string;
  seller_product_image: string;
  seller_save_product: string;
  seller_delete_product: string;
  seller_product_deleted: string;
  seller_events_title: string;
  seller_events_subtitle: string;
  seller_events_edit_btn: string;
  seller_events_reserved: string;
  seller_events_available: string;
  seller_events_collected: string;
  seller_events_attendees_title: string;
  seller_events_no_events: string;
  seller_events_no_events_desc: string;

  chat_title: string;
  chat_type_message: string;
  chat_send: string;
  chat_about_product: string;
  chat_about_order: string;
  chat_no_messages: string;
  chat_conversations: string;

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

  legal_terms: string;
  legal_privacy: string;
  legal_cookies: string;
  legal_notice: string;
  cookie_text: string;
  cookie_accept: string;
  cookie_reject: string;
  cookie_settings: string;

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

  shop_specialty: string;
  shop_hero_title: string;
  shop_hero_desc: string;
  shop_see_cheeses: string;
  shop_whatsapp_orders: string;
  shop_visit_title: string;
  shop_visit_subtitle: string;
  shop_visit_desc: string;
  shop_visit_contact: string;

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
    nav_tastings_experiences: 'Dastaketak eta Esperientziak',
    nav_corporate_gifts: 'Enpresa Opariak',
    nav_events: 'Ekitaldiak',
    nav_add_product: 'Gehitu Produktua',

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
    prod_available: 'Eskuragarri',
    prod_availability: 'Eskuragarritasuna:',

    event_seats: 'leku',
    event_seats_available: 'leku libre',
    event_capacity_full: 'Leku guztiak beteta (Agortuta)',
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

    exp_hero_badge: 'Esperientzia Gastronomikoak',
    exp_hero_title: 'Dastaketak &',
    exp_hero_title_highlight: 'Esperientziak',
    exp_hero_desc: 'Ezagutu artisau gaztaren artea gure dastaketa gidatuen, ospakizunetarako ekitaldien eta Lekeition zein zuk aukeratutako lekuan gozatzeko zerbitzu esklusiboen bidez.',
    exp_home_tasting_title: 'Dastaketak Etxean',
    exp_home_tasting_badge: 'Zure erritmoan',
    exp_home_tasting_desc: 'Bihur zaitez anfitrioi gure dastaketa-kit osoekin: 6 gazta afinatu intentsitatearen arabera sailkatuta, artisau maridajeak, dastaketa-mantel ilustratua eta fitxa azalpenak.',
    exp_home_tasting_btn: 'Eskatu Kit-a Etxerako',
    exp_store_tasting_title: 'Dastaketak Dendan',
    exp_store_tasting_badge: 'Presentziala Lekeition',
    exp_store_tasting_desc: 'Esperientzia presentzial esklusiboak Lekeitioko gure gaztategian (Gamarra Kalea 4). Gure gazta-maistruek gidatuta talde txikietan, egile-piezak eta Bizkaiko txakolina dastatuz.',
    exp_store_tasting_btn: 'Ikusi Datak & Erreserbatu Lekua',
    exp_wedding_title: 'Ezkontzetarako Mahaia',
    exp_wedding_badge: 'Ezkontzak & Ekitaldiak',
    exp_wedding_desc: 'Gazta-mahai ikusgarriak sortzen ditugu ezkontzetako kokteletarako eta ospakizunetarako. Diseinu monumentalekin, fruitu freskoekin, fruitu lehorrekin eta ogi artisauekin.',
    exp_wedding_btn: 'Eskatu Aurrekontua Ezkontzetarako',
    exp_raclette_title: 'Raclette Mailegua',
    exp_raclette_badge: 'Alokairua & Pack-a',
    exp_raclette_desc: 'Suitzar raclette makina profesionala mailegatzen dizugu, raclette gazta afinatu moztuarekin, txarkuteria artisauarekin eta patatekin, ekipamenduaz kezkatu gabe goza dezazun.',
    exp_raclette_btn: 'Kontsultatu Raclette Eskuragarritasuna',

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
    deliv_shipping_notes: 'Bidalketarako oharrak (ordutegia, atezaina...)',
    deliv_pickup_time: 'Jasotzeko gutxi gorabeherako ordua',
    deliv_pickup_address: 'Dendaren helbidea: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Berretsi eta Bidali Eskaera',
    deliv_order_success: 'Eskaera ongi burutu da!',
    deliv_order_success_desc: 'Saltzaileak zure eskaera jaso du eta prestatzen hasiko da.',

    orders_title: 'Nire Eskaerak',
    orders_title_seller: 'Eskaerak Kudeatu',
    orders_subtitle_buyer: 'Zure erosketen jarraipena, produktuak eta egoera.',
    orders_subtitle_seller: 'Bezeroaren eskaerak kudeatu, egoera eguneratu eta produktuak prestatu.',
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
    orders_no_orders_seller_sub: 'Bezeroek egindako eskaerak automatikoki agertuko dira hemen.',
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

    seller_new_product: 'Gehitu Produktu Berria',
    seller_edit_product: 'Editatu Produktua',
    seller_product_name: 'Produktuaren Izena',
    seller_product_desc: 'Deskribapena eta ezaugarriak',
    seller_product_price: 'Prezioa (€)',
    seller_product_category: 'Kategoria',
    seller_product_format: 'Formatua / Aurkezpena',
    seller_product_origin: 'Jatorria (Herria/Eskualdea)',
    seller_product_stock: 'Stock erabilgarria',
    seller_product_image: 'Produktuaren Argazkia',
    seller_save_product: 'Gorde Produktua',
    seller_delete_product: 'Ezabatu Produktua',
    seller_product_deleted: 'Produktua ezabatu da',

    seller_events_title: 'Dastaketa Presentzialak Dendan',
    seller_events_subtitle: 'Aforoa, aldagaien edizioa eta bertaratuen kudeaketa Lekeitioko dastaketetan.',
    seller_events_edit_btn: 'Editatu Dastaketa',
    seller_events_reserved: 'Erreserbatuta',
    seller_events_available: 'Libre',
    seller_events_collected: 'Bilketa',
    seller_events_attendees_title: 'Dastaketako Partaideak',
    seller_events_no_events: 'Ez duzu dastaketa presentzialik sortu oraindik',
    seller_events_no_events_desc: 'Argitaratu dastaketa presentzial bat Lekeitioko dendan goiko menutik.',

    chat_title: 'Txatak eta Mezuak',
    chat_type_message: 'Idatzi mezu bat hemen...',
    chat_send: 'Bidali',
    chat_about_product: 'Produktu honi buruz',
    chat_about_order: 'Eskaera honi buruz',
    chat_no_messages: 'Ez dago mezurik oraindik',
    chat_conversations: 'Elkarrizketak',

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
    footer_club_desc: 'Denboraldiko gazta berriak, Lekeition egindako cata esklusiboak eta lote mugatuak besteen aurretik.',
    footer_join_whatsapp: 'WhatsApp bidez sartu',
    footer_cheese_desc: 'Afilatutako gaztak, kantabriar gatzadurak eta eskuz hautatutako artisau kontserbak.',
    footer_delivery_desc: 'Hotz-katea bermatuta 24/48 ordutan, produktu bakoitza bere puntuan irits dadin.',
    footer_pickup_desc: 'Eskatu online eta jaso prestatuta itxaron gabe gure Lekeitioko gaztaterian.',
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

    shop_specialty: 'Gure Espezialitatea',
    shop_hero_title: 'Gaztak eta opari gastronomikoak Lekeition',
    shop_hero_desc: 'Egileak sinatutako gaztak, Kantabriako altxorrak eta hautatutako marinadak. Lekeitioko zapore benetakoa opari eta gozatzeko.',
    shop_see_cheeses: 'GURE GAZTAK IKUSI',
    shop_whatsapp_orders: 'WhatsApp bidez eskaerak',
    shop_visit_title: 'Gure Gaztategia & Gourmet Gunea',
    shop_visit_subtitle: 'Bisitatu Lekeition · Km0',
    shop_visit_desc: 'Gure webgunean aukeraketa bat ikusten duzu, gure Lekeitioko gaztaterian dena duzu: 80 baino gehiago erreferentzia artisau gazta, Kantabriako kontserbak eta gure gazta maisuek emandako aholkularitza pertsonalizatua.',
    shop_visit_contact: 'Kontaktatu Dendarekin',

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
    nav_tastings_experiences: 'Catas & Experiencias',
    nav_corporate_gifts: 'Regalos de Empresa',
    nav_events: 'Eventos',
    nav_add_product: 'Añadir Producto',

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
    prod_available: 'Disponible',
    prod_availability: 'Disponibilidad:',

    event_seats: 'plazas',
    event_seats_available: 'plazas disponibles',
    event_capacity_full: 'Aforo Completo (Sin Plazas)',
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

    exp_hero_badge: 'Experiencias Gastronómicas',
    exp_hero_title: 'Catas &',
    exp_hero_title_highlight: 'Experiencias',
    exp_hero_desc: 'Descubre el arte del queso artesano a través de nuestras catas guiadas, eventos para celebraciones y servicios exclusivos para disfrutar en Lekeitio o donde tú elijas.',
    exp_home_tasting_title: 'Catas en Casa',
    exp_home_tasting_badge: 'A tu ritmo',
    exp_home_tasting_desc: 'Conviértete en anfitrión con nuestros kits completos de cata: selección de 6 quesos afinados clasificados por intensidades, maridajes artesanos de acompañamiento, mantel de cata ilustrado y fichas explicativas con notas de cata y maridajes.',
    exp_home_tasting_btn: 'Solicitar Kit para Casa',
    exp_store_tasting_title: 'Catas en la Tienda',
    exp_store_tasting_badge: 'Presencial en Lekeitio',
    exp_store_tasting_desc: 'Experiencias presenciales exclusivas en nuestra quesería de Lekeitio (Gamarra Kalea 4). Guiadas por nuestros afinadores queseros en grupos reducidos, probando piezas de autor, txakoli de Bizkaia y maridajes singulares.',
    exp_store_tasting_btn: 'Ver Fechas & Reservar Plaza',
    exp_wedding_title: 'Mesa para Bodas',
    exp_wedding_badge: 'Bodas & Eventos',
    exp_wedding_desc: 'Creamos mesas de quesos espectaculares para cócteles de bodas y celebraciones. Diseños monumentales con frutas frescas, frutos secos, panes artesanos, confituras y una selección afinada que dejará impresionados a todos los invitados.',
    exp_wedding_btn: 'Pedir Presupuesto para Bodas',
    exp_raclette_title: 'Préstamo de Raclette',
    exp_raclette_badge: 'Alquiler & Pack',
    exp_raclette_desc: 'Te prestamos la máquina profesional de raclette tradicional suiza junto con el queso de raclette afinado cortado a la perfección, embutidos artesanos y patatas para que disfrutes de una velada única sin preocuparte por el equipamiento.',
    exp_raclette_btn: 'Consultar Disponibilidad de Raclette',

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
    deliv_shipping_notes: 'Notas de entrega (horario preferente, portería...)',
    deliv_pickup_time: 'Hora aproximada de recogida',
    deliv_pickup_address: 'Dirección de la tienda: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirmar y Realizar Pedido',
    deliv_order_success: '¡Pedido realizado con éxito!',
    deliv_order_success_desc: 'El artesano ha recibido tu pedido y comenzará a prepararlo.',

    orders_title: 'Mis Pedidos',
    orders_title_seller: 'Gestión de Pedidos',
    orders_subtitle_buyer: 'Seguimiento, detalles de productos y estado de tus compras gourmet.',
    orders_subtitle_seller: 'Gestiona pedidos de clientes, actualiza estados y revisa los productos encargados.',
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
    orders_no_orders_seller_sub: 'Los nuevos pedidos de tus clientes aparecerán aquí automáticamente.',
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

    seller_new_product: 'Añadir Producto Gourmet',
    seller_edit_product: 'Editar Producto',
    seller_product_name: 'Nombre del Producto',
    seller_product_desc: 'Descripción y notas de cata',
    seller_product_price: 'Precio (€)',
    seller_product_category: 'Categoría',
    seller_product_format: 'Formato / Presentación',
    seller_product_origin: 'Origen (Localidad/Denominación)',
    seller_product_stock: 'Stock disponible',
    seller_product_image: 'Fotografía del Producto',
    seller_save_product: 'Guardar Producto',
    seller_delete_product: 'Eliminar Producto',
    seller_product_deleted: 'Producto eliminado correctamente',

    seller_events_title: 'Catas Presenciales en Tienda',
    seller_events_subtitle: 'Control de aforo, edición de variables y gestión de asistentes para catas en Lekeitio.',
    seller_events_edit_btn: 'Editar Cata',
    seller_events_reserved: 'Reservadas',
    seller_events_available: 'Disponibles',
    seller_events_collected: 'Recaudado',
    seller_events_attendees_title: 'Participantes de la Cata',
    seller_events_no_events: 'No tienes catas presenciales creadas todavía',
    seller_events_no_events_desc: 'Publica una cata presencial en la tienda de Lekeitio desde el menú superior para gestionar aforo, plazas y asistentes.',

    chat_title: 'Mensajes & Asesoramiento',
    chat_type_message: 'Escribe tu mensaje aquí...',
    chat_send: 'Enviar',
    chat_about_product: 'Sobre este producto',
    chat_about_order: 'Sobre este pedido',
    chat_no_messages: 'No hay mensajes aún',
    chat_conversations: 'Conversaciones',

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
    cookie_text: 'Utilizamos cookies para garantizar la mejor experiencia gastronómica en nuestra tienda.',
    cookie_accept: 'Aceptar Todas',
    cookie_reject: 'Rechazar',
    cookie_settings: 'Configurar',

    footer_club_title: 'Club de Amigos del Buen Queso',
    footer_club_subtitle: '¿Quieres estar al día de las novedades de EkhiTeka?',
    footer_club_desc: 'Nuevas llegadas de quesos de temporada, catas exclusivas en Lekeitio y lotes limitados antes que nadie.',
    footer_join_whatsapp: 'Unirme por WhatsApp',
    footer_cheese_desc: 'Quesos afinados, salazones del cantábrico y conservas artesanales seleccionadas una a una.',
    footer_delivery_desc: 'Cadena de frío garantizada 24/48 horas para que cada producto llegue en su punto óptimo.',
    footer_pickup_desc: 'Haz tu pedido online y recógelo preparado sin esperas en nuestra quesería de Lekeitio.',
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

    shop_specialty: 'Nuestra Especialidad',
    shop_hero_title: 'Quesos y regalos gastronómicos en Lekeitio',
    shop_hero_desc: 'Quesos afinados de autor, tesoros del Cantábrico y maridajes selectos. El sabor auténtico de Lekeitio para regalar y disfrutar.',
    shop_see_cheeses: 'VER NUESTROS QUESOS',
    shop_whatsapp_orders: 'Encargos por WhatsApp',
    shop_visit_title: 'Nuestra Quesería & Espacio Gourmet',
    shop_visit_subtitle: 'Visítanos en Lekeitio · Km0',
    shop_visit_desc: 'En nuestra web ves una selección, en nuestra quesería de Lekeitio lo tienes todo: más de 80 referencias de quesos artesanos afinados, conservas selectas del Cantábrico y el asesoramiento personalizado de nuestros maestros queseros.',
    shop_visit_contact: 'Contactar con la Tienda',

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
    nav_tastings_experiences: 'Tastings & Experiences',
    nav_corporate_gifts: 'Corporate Gifts',
    nav_events: 'Events',
    nav_add_product: 'Add Product',

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
    prod_available: 'Available',
    prod_availability: 'Availability:',

    event_seats: 'seats',
    event_seats_available: 'seats available',
    event_capacity_full: 'Full Capacity (Sold Out)',
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

    exp_hero_badge: 'Gourmet Experiences',
    exp_hero_title: 'Tastings &',
    exp_hero_title_highlight: 'Experiences',
    exp_hero_desc: 'Discover the craft of artisan cheese through our guided tastings, celebration events and bespoke services to enjoy in Lekeitio or wherever you choose.',
    exp_home_tasting_title: 'Tastings at Home',
    exp_home_tasting_badge: 'At your own pace',
    exp_home_tasting_desc: 'Host your own tasting with our complete kits: selection of 6 aged artisan cheeses classified by intensity, artisanal pairings, illustrated tasting placemat and tasting notes.',
    exp_home_tasting_btn: 'Order Home Tasting Kit',
    exp_store_tasting_title: 'In-Store Tastings',
    exp_store_tasting_badge: 'In-person in Lekeitio',
    exp_store_tasting_desc: 'Exclusive in-person experiences in our Lekeitio cheesemonger (Gamarra Kalea 4). Guided by master cheesemongers in small groups with author cheeses and Basque txakoli.',
    exp_store_tasting_btn: 'View Dates & Book Seat',
    exp_wedding_title: 'Wedding Cheese Tables',
    exp_wedding_badge: 'Weddings & Events',
    exp_wedding_desc: 'We design stunning cheese tables for wedding cocktails and private events. Monumental layouts with fresh fruit, nuts, artisan breads, chutneys and a refined cheese selection.',
    exp_wedding_btn: 'Request Wedding Quote',
    exp_raclette_title: 'Raclette Hire',
    exp_raclette_badge: 'Hire & Pack',
    exp_raclette_desc: 'We lend you the traditional Swiss raclette machine along with pre-sliced aged raclette cheese, artisan cured meats and potatoes for an unforgettable evening without equipment hassle.',
    exp_raclette_btn: 'Check Raclette Availability',

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
    deliv_shipping_notes: 'Delivery notes (preferred time, building instructions...)',
    deliv_pickup_time: 'Estimated pickup time',
    deliv_pickup_address: 'Store Address: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirm & Place Order',
    deliv_order_success: 'Order placed successfully!',
    deliv_order_success_desc: 'The artisan has received your order and is preparing it.',

    orders_title: 'My Orders',
    orders_title_seller: 'Order Management',
    orders_subtitle_buyer: 'Track your purchases, product details and order status.',
    orders_subtitle_seller: 'Manage customer orders, update statuses and review items.',
    orders_status: 'Status',
    orders_pending: 'Pending Validation',
    orders_confirmed: 'Confirmed',
    orders_preparing: 'Preparing',
    orders_ready_delivery: 'Ready for Pickup/Delivery',
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

    seller_new_product: 'Add Gourmet Product',
    seller_edit_product: 'Edit Product',
    seller_product_name: 'Product Name',
    seller_product_desc: 'Description & Tasting Notes',
    seller_product_price: 'Price (€)',
    seller_product_category: 'Category',
    seller_product_format: 'Format / Presentation',
    seller_product_origin: 'Origin / Region',
    seller_product_stock: 'Available Stock',
    seller_product_image: 'Product Photo',
    seller_save_product: 'Save Product',
    seller_delete_product: 'Delete Product',
    seller_product_deleted: 'Product deleted successfully',

    seller_events_title: 'In-Store In-Person Tastings',
    seller_events_subtitle: 'Capacity control, variables edition and attendee management for tastings in Lekeitio.',
    seller_events_edit_btn: 'Edit Tasting',
    seller_events_reserved: 'Booked',
    seller_events_available: 'Available',
    seller_events_collected: 'Collected',
    seller_events_attendees_title: 'Tasting Attendees',
    seller_events_no_events: 'You have no in-person tastings created yet',
    seller_events_no_events_desc: 'Publish an in-person tasting in our Lekeitio shop from the top menu to manage capacity and attendees.',

    chat_title: 'Messages & Support',
    chat_type_message: 'Type your message here...',
    chat_send: 'Send',
    chat_about_product: 'About this item',
    chat_about_order: 'About this order',
    chat_no_messages: 'No messages yet',
    chat_conversations: 'Conversations',

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
    footer_club_desc: 'Seasonal cheese arrivals, exclusive tastings in Lekeitio and limited batches — before anyone else.',
    footer_join_whatsapp: 'Join via WhatsApp',
    footer_cheese_desc: 'Aged artisan cheeses, Cantabrian salted fish and hand-picked preserves.',
    footer_delivery_desc: 'Cold chain guaranteed 24/48 hours so every product arrives in perfect condition.',
    footer_pickup_desc: 'Order online and collect your prepared order with no wait at our Lekeitio cheesemonger.',
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

    shop_specialty: 'Our Speciality',
    shop_hero_title: 'Artisan cheeses & gourmet gifts in Lekeitio',
    shop_hero_desc: 'Author-aged cheeses, Cantabrian treasures and curated pairings. The authentic taste of Lekeitio to gift and enjoy.',
    shop_see_cheeses: 'SEE OUR CHEESES',
    shop_whatsapp_orders: 'Custom Orders via WhatsApp',
    shop_visit_title: 'Our Cheesemonger & Gourmet Space',
    shop_visit_subtitle: 'Visit us in Lekeitio · Km0',
    shop_visit_desc: 'Our website shows a selection, but our Lekeitio shop has it all: over 80 references of aged artisan cheeses, Cantabrian preserved fish and personalised advice from our master cheesemongers.',
    shop_visit_contact: 'Contact the Shop',

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
    nav_tastings_experiences: 'Dégustations & Expériences',
    nav_corporate_gifts: 'Cadeaux d\\'Entreprise',
    nav_events: 'Événements',
    nav_add_product: 'Ajouter un Produit',

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
    prod_available: 'Disponible',
    prod_availability: 'Disponibilité :',

    event_seats: 'places',
    event_seats_available: 'places disponibles',
    event_capacity_full: 'Complet (Plus de places)',
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

    exp_hero_badge: 'Expériences Gastronomiques',
    exp_hero_title: 'Dégustations &',
    exp_hero_title_highlight: 'Expériences',
    exp_hero_desc: 'Découvrez l\\'art du fromage fermier à travers nos dégustations guidées, événements de célébration et services exclusifs à Lekeitio ou au lieu de votre choix.',
    exp_home_tasting_title: 'Dégustations à la Maison',
    exp_home_tasting_badge: 'À votre rythme',
    exp_home_tasting_desc: 'Devenez l\\'hôte idéal grâce à nos kits complets : sélection de 6 fromages affinés par intensités, accords artisanaux, set de table illustré et fiches de dégustation explicatives.',
    exp_home_tasting_btn: 'Commander Kit à Domicile',
    exp_store_tasting_title: 'Dégustations en Boutique',
    exp_store_tasting_badge: 'En présentiel à Lekeitio',
    exp_store_tasting_desc: 'Expériences présentielles exclusives dans notre fromagerie de Lekeitio (Gamarra Kalea 4). Guidées par nos maîtres affineurs en petits groupes avec txakoli de Biscaye.',
    exp_store_tasting_btn: 'Voir les Dates & Réserver',
    exp_wedding_title: 'Buffets Fromages de Mariage',
    exp_wedding_badge: 'Mariages & Événements',
    exp_wedding_desc: 'Nous créons des buffets de fromages spectaculaires pour cocktails de mariage et fêtes. Mises en scène monumentales avec fruits frais, fruits secs, pains et confitures artisanales.',
    exp_wedding_btn: 'Demander un Devis Mariage',
    exp_raclette_title: 'Prêt d\\'Appareil à Raclette',
    exp_raclette_badge: 'Location & Pack',
    exp_raclette_desc: 'Nous vous prêtons l\\'appareil traditionnel suisse professionnel avec le fromage à raclette affiné prédécoupé, charcuteries et pommes de terre pour une soirée conviviale sans contrainte.',
    exp_raclette_btn: 'Consulter la Disponibilité Raclette',

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
    deliv_shipping_notes: 'Instructions de livraison (digicode, créneau...)',
    deliv_pickup_time: 'Heure de retrait estimée',
    deliv_pickup_address: 'Adresse boutique : Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirmer la commande',
    deliv_order_success: 'Commande validée avec succès !',
    deliv_order_success_desc: 'L\\'artisan a reçu votre commande et prépare vos produits.',

    orders_title: 'Mes Commandes',
    orders_title_seller: 'Gestion des Commandes',
    orders_subtitle_buyer: 'Suivez vos achats, les détails des produits et le statut de vos commandes.',
    orders_subtitle_seller: 'Gérez les commandes clients, mettez à jour les statuts et préparez les articles.',
    orders_status: 'Statut',
    orders_pending: 'À valider',
    orders_confirmed: 'Validée',
    orders_preparing: 'En préparation',
    orders_ready_delivery: 'Prête pour retrait/livraison',
    orders_delivered: 'Livrée',
    orders_cancelled: 'Annulée',
    orders_change_status: 'Changer le statut',
    orders_cancel_order: 'Annuler la commande',
    orders_cancel_reason: 'Motif d\\'annulation',
    orders_chat_with_buyer: 'Chat avec le client',
    orders_chat_with_seller: 'Chat avec l\\'artisan',
    orders_no_orders: 'Vous n\\'avez aucune commande pour le moment',
    orders_no_orders_seller: 'Aucune commande reçue pour le moment',
    orders_no_orders_seller_sub: 'Les nouvelles commandes de vos clients apparaîtront ici automatiquement.',
    orders_products_label: 'Articles de la commande',
    orders_products_to_prepare: 'Articles à préparer',
    orders_purchase_date: 'Date d\\'achat',
    orders_date_time: 'Date & Heure',
    orders_order_number: 'Commande :',
    orders_total_to_charge: 'Total à encaisser :',
    orders_new_status: 'Mise à jour ! Le statut de votre commande a changé :',
    orders_mark_seen: 'Marquer comme lu',
    orders_client_label: 'Client',
    orders_qty_label: 'Quantité',

    status_confirm: 'Confirmer',
    status_preparing: 'En préparation',
    status_ready: 'Prête',
    status_delivered: 'Livrée',

    seller_new_product: 'Ajouter un Produit Gourmet',
    seller_edit_product: 'Modifier le Produit',
    seller_product_name: 'Nom du Produit',
    seller_product_desc: 'Description et notes de dégustation',
    seller_product_price: 'Prix (€)',
    seller_product_category: 'Catégorie',
    seller_product_format: 'Format / Présentation',
    seller_product_origin: 'Origine / Terroir',
    seller_product_stock: 'Stock disponible',
    seller_product_image: 'Photo du Produit',
    seller_save_product: 'Enregistrer le Produit',
    seller_delete_product: 'Supprimer le Produit',
    seller_product_deleted: 'Produit supprimé avec succès',

    seller_events_title: 'Dégustations en Boutique',
    seller_events_subtitle: 'Contrôle de jauge, modification des variables et gestion des inscrits à Lekeitio.',
    seller_events_edit_btn: 'Modifier la Dégustation',
    seller_events_reserved: 'Réservées',
    seller_events_available: 'Disponibles',
    seller_events_collected: 'Encaissé',
    seller_events_attendees_title: 'Participants à la Dégustation',
    seller_events_no_events: 'Vous n\\'avez pas encore créé de dégustation en boutique',
    seller_events_no_events_desc: 'Publiez une dégustation en boutique depuis le menu supérieur pour gérer la jauge et les réservations.',

    chat_title: 'Messagerie & Conseils',
    chat_type_message: 'Écrivez votre message ici...',
    chat_send: 'Envoyer',
    chat_about_product: 'À propos de cet article',
    chat_about_order: 'À propos de cette commande',
    chat_no_messages: 'Aucun message pour le moment',
    chat_conversations: 'Conversations',

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
    cookie_text: 'Nous utilisons des cookies pour vous garantir la meilleure expérience gastronomique.',
    cookie_accept: 'Tout Accepter',
    cookie_reject: 'Refuser',
    cookie_settings: 'Personnaliser',

    footer_club_title: 'Club des Amis du Bon Fromage',
    footer_club_subtitle: 'Vous souhaitez rester informé des actualités d\\'EkhiTeka ?',
    footer_club_desc: 'Nouvelles arrivées de fromages de saison, dégustations exclusives à Lekeitio et lots limités avant tout le monde.',
    footer_join_whatsapp: 'Rejoindre par WhatsApp',
    footer_cheese_desc: 'Fromages affinés, poissons salés du Cantabrique et conserves artisanales sélectionnées à la main.',
    footer_delivery_desc: 'Chaîne du froid garantie 24/48h pour que chaque produit arrive dans son état optimal.',
    footer_pickup_desc: 'Commandez en ligne et récupérez votre commande prête sans attente dans notre fromagerie de Lekeitio.',
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

    shop_specialty: 'Notre Spécialité',
    shop_hero_title: 'Fromages et cadeaux gastronomiques à Lekeitio',
    shop_hero_desc: 'Fromages affinés d\\'auteur, trésors du Cantabrique et accords sélectionnés. La saveur authentique de Lekeitio à offrir et à savourer.',
    shop_see_cheeses: 'VOIR NOS FROMAGES',
    shop_whatsapp_orders: 'Commandes sur WhatsApp',
    shop_visit_title: 'Notre Fromagerie & Espace Gourmet',
    shop_visit_subtitle: 'Venez nous rendre visite à Lekeitio · Km0',
    shop_visit_desc: 'Sur notre site vous voyez une sélection, dans notre fromagerie de Lekeitio vous trouvez tout : plus de 80 références de fromages artisanaux affinés, conserves du Cantabrique et conseils personnalisés de nos maîtres fromagers.',
    shop_visit_contact: 'Contacter la Boutique',

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

  // 2. EXPERIENCIAS (Estructura y Orden Solicitado)
  'app/experiencias/page.tsx': `import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import type { ProductWithSeller } from '@/types/database';
import {
  Wine,
  Store,
  HeartHandshake,
  Sparkles,
  Flame,
  Calendar,
} from 'lucide-react';

export const revalidate = 0;

export default async function ExperienciasPage() {
  const supabase = await createClient();

  const [{ data: { user } }, productsRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('*, profiles!products_seller_id_fkey(id, full_name, town, avatar_url, phone)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ]);

  let isSeller = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'vendedor' || profile?.role === 'admin') {
      isSeller = true;
    }
  }

  const allProducts = (productsRes.data || []) as unknown as ProductWithSeller[];

  const tastingProducts = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (cat === 'tarjeta_regalo' || (name.includes('tarjeta') && name.includes('regalo'))) {
      return false;
    }

    return (
      cat === 'cata_casa' ||
      cat === 'cata_presencial' ||
      cat === 'catas' ||
      cat === 'experiencia' ||
      name.includes('cata') ||
      name.includes('degustación') ||
      name.includes('taller') ||
      desc.includes('cata')
    );
  });

  const presencialEvents = allProducts.filter((p) => {
    const cat = (p.category_id || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (
      name.includes('casa') ||
      cat.includes('casa') ||
      cat === 'cesta' ||
      cat === 'tarjeta_regalo' ||
      name.includes('tarjeta') ||
      name.includes('cesta')
    ) {
      return false;
    }

    return (
      cat === 'cata_presencial' ||
      name.includes('presencial') ||
      desc.includes('presencial') ||
      (desc.includes('fecha & hora') && desc.includes('aforo'))
    );
  });

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Tarjeta presentación */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border-2 border-stone-800 shadow-2xl min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/secciones/Catas.JPG"
            alt="Catas & Experiencias EkhiTeka"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-black/10 dark:from-black/90 dark:via-black/75 dark:to-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE259] text-[#1D1D1B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Experiencias Gastronómicas
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            Catas & <span className="text-[#FFE259]">Experiencias</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Descubre el arte del queso artesano a través de nuestras catas guiadas, eventos para celebraciones y servicios exclusivos para disfrutar en Lekeitio o donde tú elijas.
          </p>
        </div>
      </section>

      {/* 2. Info Catas en Casa e Info Catas en la Tienda */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Catas.JPG"
              alt="Catas en Casa"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              A tu ritmo
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Wine className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
                Catas en Casa
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Conviértete en anfitrión con nuestros kits completos de cata: selección de 6 quesos afinados clasificados por intensidades, maridajes artesanos de acompañamiento, mantel de cata ilustrado y fichas explicativas con notas de cata y maridajes.
            </p>
            {!isSeller && (
              <div className="pt-2">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quisiera%20reservar%20un%20Kit%20de%20Cata%20en%20Casa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
                >
                  <span>Solicitar Kit para Casa</span>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Tienda.JPG"
              alt="Catas en la Tienda Lekeitio"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              Presencial en Lekeitio
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Store className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
                Catas en la Tienda
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Experiencias presenciales exclusivas en nuestra quesería de Lekeitio (Gamarra Kalea 4). Guiadas por nuestros afinadores queseros en grupos reducidos, probando piezas de autor, txakoli de Bizkaia y maridajes singulares.
            </p>
            {!isSeller && (
              <div className="pt-2">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quisiera%20consultar%20el%20calendario%20de%20Catas%20en%20la%20Tienda%20de%20Lekeitio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
                >
                  <span>Ver Fechas & Reservar Plaza</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Productos tipo cata en casa y cata presencial */}
      {tastingProducts.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259]">
              Catálogo de Catas & Packs
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Catas & Experiencias Disponibles
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {tastingProducts.map((product) => (
              <ProductCard key={product.id} product={product} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Próximos eventos de catas presenciales */}
      {presencialEvents.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C68D07] dark:text-[#FFE259] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Plazas limitadas · Lekeitio Centro</span>
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 uppercase">
              Próximos Eventos de Catas Presenciales
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {presencialEvents.map((event) => (
              <ProductCard key={event.id} product={event} isSeller={isSeller} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Mesa para Bodas y Préstamo de Raclette */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Mesas.JPG"
              alt="Mesa de Quesos para Bodas"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              Bodas & Eventos
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <HeartHandshake className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Mesa para Bodas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Creamos mesas de quesos espectaculares para cócteles de bodas y celebraciones. Diseños monumentales con frutas frescas, frutos secos, panes artesanos, confituras y una selección afinada que dejará impresionados a todos los invitados.
            </p>
            {!isSeller && (
              <div className="pt-2">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quisiera%20presupuesto%20para%20Mesa%20de%20Quesos%20para%20Boda/Evento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
                >
                  <span>Pedir Presupuesto para Bodas</span>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
          <div className="relative h-64 overflow-hidden">
            <img
              src="/images/secciones/Quesos.JPG"
              alt="Préstamo de Raclette"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-xs font-black uppercase tracking-wider rounded-full shadow-md">
              Alquiler & Pack
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C68D07] dark:text-[#FFE259]">
              <Flame className="w-6 h-6" />
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Préstamo de Raclette
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              Te prestamos la máquina profesional de raclette tradicional suiza junto con el queso de raclette afinado cortado a la perfección, embutidos artesanos y patatas para que disfrutes de una velada única sin preocuparte por el equipamiento.
            </p>
            {!isSeller && (
              <div className="pt-2">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quisiera%20información%20sobre%20el%20Préstamo%20de%20Raclette%20y%20pack%20de%20queso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE259] text-[#1D1D1B] font-black text-xs uppercase tracking-wider transition-all hover:scale-102 font-serif"
                >
                  <span>Consultar Disponibilidad de Raclette</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
`,

  // 3. TARJETA DE PRODUCTO LEGIBLE
  'components/ProductCard.tsx': `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { deleteProduct } from '@/app/actions/products';
import { getProductImage } from '@/lib/productHelpers';
import type { ProductWithSeller } from '@/types/database';
import { ShoppingBag, MessageCircle, MapPin, Check, Pencil, Trash2, Ticket } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithSeller;
  isSeller?: boolean;
}

export function ProductCard({ product, isSeller = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSoldOut = !product.is_unlimited_stock && (product.stock ?? 0) <= 0;
  const isLowStock = !product.is_unlimited_stock && (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5;
  const isEvent =
    product.category_id === 'catas' ||
    product.category_id === 'cata_presencial' ||
    product.category_id === 'experiencia' ||
    product.name.toLowerCase().includes('cata');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, 'EkhiTeka Selección');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(\`¿Eliminar "\${product.name}" del catálogo de EkhiTeka?\`)) {
      setIsDeleting(true);
      await deleteProduct(product.id);
      window.location.reload();
    }
  };

  const sellerName = 'EkhiTeka Gourmet Lekeitio';
  const sellerId = product.seller_id;
  const imageUrl = getProductImage(product);

  return (
    <article
      aria-label={product.name}
      className={\`manduca-card group relative bg-white dark:bg-[#1C1B19] rounded-3xl border border-stone-200/90 dark:border-stone-800 hover:border-[#FFE259] dark:hover:border-[#FFE259] shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-300 \${
        isDeleting ? 'opacity-40 pointer-events-none' : ''
      }\`}
    >
      <div className="relative aspect-4/3 w-full bg-[#FAF7F2] dark:bg-stone-850 overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/secciones/Quesos.JPG';
          }}
        />

        {product.origin_region && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-[#1D1D1B]/85 dark:bg-black/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-wider shadow-xs max-w-[55%] truncate">
            <MapPin className="w-3 h-3 text-[#FFE259] shrink-0" />
            <span className="truncate">{product.origin_region}</span>
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 flex items-center">
          {isSoldOut ? (
            <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-wider shadow-md animate-pulse">
              {isEvent ? 'Sin Plazas' : 'Agotado'}
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-md">
              {isEvent ? \`¡\${product.stock} plazas!\` : \`¡\${product.stock} uds!\`}
            </span>
          ) : isEvent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-md">
              <Ticket className="w-3 h-3" />
              <span>{product.stock} plazas</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#FFE259] text-[#1D1D1B] text-[10px] sm:text-[11px] font-black rounded-xl uppercase tracking-tight shadow-xs">
              Artisau
            </span>
          )}
        </div>

        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs text-stone-900 dark:text-stone-100 text-[10px] sm:text-[11px] font-bold rounded-xl uppercase tracking-tight shadow-xs border border-stone-200/80 dark:border-stone-700/80">
          {product.format} {product.weight_g ? \`· \${product.weight_g}g\` : ''}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-black text-[#C68D07] dark:text-[#FFE259] uppercase tracking-wider truncate">
            {sellerName}
          </p>

          <Link
            href={\`/producto/\${product.id}\`}
            className="block group-hover:text-[#C68D07] dark:group-hover:text-[#FFE259] transition-colors"
          >
            <h2 className="font-serif font-black text-stone-900 dark:text-stone-100 text-base sm:text-lg leading-snug break-words">
              {product.name}
            </h2>
          </Link>

          {product.description && (
            <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed pt-0.5 font-medium whitespace-pre-line line-clamp-4">
              {product.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          <div className="shrink-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
              {isEvent ? 'Precio / Plaza' : t.prod_price}
            </span>
            <span className="text-base sm:text-xl font-black text-[#1D1D1B] dark:text-stone-100 font-serif">
              {Number(product.price).toFixed(2)} €
            </span>
          </div>

          {isSeller ? (
            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <Link
                href={\`/vendedor/productos/\${product.id}/editar\`}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] font-black text-xs transition-all shadow-2xs hover:scale-102 font-serif uppercase tracking-wider cursor-pointer"
                title="Editar Producto"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-colors cursor-pointer border border-red-200 dark:border-red-800"
                title="Eliminar Producto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <Link
                href={\`/chat/\${sellerId}?product_id=\${product.id}\`}
                className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-[#FFE259]/30 text-stone-700 dark:text-stone-300 transition-colors border border-stone-200 dark:border-stone-700 shrink-0"
                title={t.prod_ask_artisan}
              >
                <MessageCircle className="w-4 h-4 text-stone-700 dark:text-stone-200" />
              </Link>

              <button
                type="button"
                disabled={isSoldOut}
                onClick={handleQuickAdd}
                className={\`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 font-serif cursor-pointer shrink-0 \${
                  isSoldOut
                    ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#FFE259] hover:bg-[#F5D742] text-[#1D1D1B] hover:shadow-md hover:scale-102'
                }\`}
              >
                {isSoldOut ? (
                  <span>{isEvent ? 'Sin plazas' : 'Agotado'}</span>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Añadido</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isEvent ? 'Reservar' : t.prod_add_to_cart}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
`
};

console.log('📦 Escribiendo archivos en el proyecto EkhiTeka...');

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`✅ Creado / Actualizado: ${filePath}`);
});

console.log('\n🎉 ¡Todos los archivos se han aplicado correctamente en sus carpetas!');