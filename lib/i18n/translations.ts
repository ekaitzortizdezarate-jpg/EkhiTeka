export type Language = 'eu' | 'es' | 'en' | 'fr';

export interface TranslationDict {
  brand_name: string;
  brand_tagline: string;
  brand_subtitle: string;
  header_subtitle: string;
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
  profile_main_title: string;
  profile_main_subtitle: string;
  profile_personal_data: string;
  profile_address_data: string;
  profile_contact_data: string;
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
  profile_status_complete: string;
  profile_status_incomplete: string;

  // Profile (extended)
  profile_tab_user: string;
  profile_tab_store: string;
  profile_seller_data: string;
  profile_user_data: string;
  profile_seller_desc: string;
  profile_full_name: string;
  profile_town_province: string;
  profile_user_address: string;
  profile_seller_addr_optional: string;
  profile_seller_no_address: string;
  profile_password_open_desc: string;
  profile_password_closed_desc: string;
  profile_password_success: string;
  profile_required_mark: string;
  profile_optional_mark: string;

  // Store Management (Profile -> Tienda)
  store_wa_title: string;
  store_wa_desc: string;
  store_wa_add_btn: string;
  store_wa_alert_empty: string;
  store_wa_alert_no_active: string;
  store_wa_badge_active: string;
  store_wa_badge_inactive: string;
  store_btn_enable: string;
  store_btn_disable: string;
  store_edit_contact: string;
  store_delete_contact: string;
  store_wa_confirm_delete: string;
  store_config_updated_success: string;

  store_pickup_title: string;
  store_pickup_desc: string;
  store_pickup_add_btn: string;
  store_pickup_alert_empty: string;
  store_pickup_alert_no_active: string;
  store_pickup_confirm_delete: string;
  store_schedule_label: string;

  store_event_title: string;
  store_event_desc: string;
  store_event_add_btn: string;
  store_event_alert_empty: string;
  store_event_alert_no_active: string;
  store_event_confirm_delete: string;
  store_notes_label: string;

  // Store Modals
  store_modal_wa_edit: string;
  store_modal_wa_new: string;
  store_modal_wa_source_label: string;
  store_modal_wa_choose_seller: string;
  store_modal_wa_manual_input: string;
  store_modal_wa_select_seller: string;
  store_modal_wa_name: string;
  store_modal_wa_phone: string;
  store_modal_wa_save: string;

  store_modal_pickup_edit: string;
  store_modal_pickup_new: string;
  store_modal_pickup_title_field: string;
  store_modal_pickup_schedule_field: string;
  store_modal_pickup_save: string;

  store_modal_event_edit: string;
  store_modal_event_new: string;
  store_modal_event_title_field: string;
  store_modal_event_notes_field: string;
  store_modal_event_save: string;

  // Shop Section (CatalogView & Hero)
  shop_specialty: string;
  shop_hero_title: string;
  shop_hero_desc: string;
  shop_see_cheeses: string;
  shop_whatsapp_orders: string;
  shop_visit_title: string;
  shop_visit_subtitle: string;
  shop_visit_desc: string;
  shop_visit_contact: string;

  // Chat Section
  chat_title: string;
  chat_type_message: string;
  chat_send: string;
  chat_about_product: string;
  chat_about_order: string;
  chat_no_messages: string;
  chat_conversations: string;

  // Seller Dashboard & Product Form
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
  seller_events_col_buyer: string;
  seller_events_col_contact: string;
  seller_events_col_seats: string;
  seller_events_col_date: string;
  seller_events_col_total: string;
  seller_events_col_actions: string;
  seller_events_badge_store: string;
  seller_events_occupied_seats: string;
  seller_events_no_reservations: string;
  seller_events_open_chat_title: string;
  seller_events_remove_participant_title: string;
  seller_events_modal_title: string;
  seller_events_modal_notice: string;
  seller_events_modal_name_label: string;
  seller_events_modal_price_label: string;
  seller_events_modal_stock_label: string;
  seller_events_modal_location_label: string;
  seller_events_modal_desc_label: string;
  seller_events_modal_desc_placeholder: string;
  seller_events_modal_save_notify: string;
  seller_events_modal_saving_notify: string;
  seller_events_remove_prompt: string;
  seller_events_edit_success: string;

  // Seller Product Form (extended)
  seller_shared_catalog_subtitle: string;
  seller_last_modified_by: string;
  seller_step1_label: string;
  seller_type_single: string;
  seller_type_hamper: string;
  seller_type_store_tasting: string;
  seller_type_home_tasting: string;
  seller_type_gift_card: string;

  seller_step2_label: string;
  seller_name_product_label: string;
  seller_name_event_label: string;
  seller_name_placeholder_single: string;
  seller_name_placeholder_hamper: string;
  seller_name_placeholder_event: string;

  seller_catalog_select_title: string;
  seller_catalog_select_desc: string;
  seller_catalog_no_singles: string;
  seller_qty_label: string;
  seller_btn_add: string;

  seller_custom_product_accordion_title: string;
  seller_custom_product_accordion_desc: string;
  seller_custom_photo_label: string;
  seller_custom_url_fallback: string;
  seller_btn_add_to_list: string;

  seller_list_items_title: string;
  seller_badge_custom_item: string;
  seller_list_total_sum: string;
  seller_list_empty_desc: string;

  seller_sale_price_label: string;
  seller_price_per_seat_label: string;
  seller_original_sum_helper: string;
  seller_discount_label: string;
  seller_discount_applied_notice: string;
  seller_discount_surcharge_notice: string;
  seller_discount_zero_notice: string;
  seller_discount_need_items_notice: string;

  seller_stock_available_label: string;
  seller_seats_capacity_label: string;
  seller_unlimited_checkbox: string;

  seller_format_unit: string;
  seller_format_weight: string;
  seller_format_jar: string;
  seller_format_can: string;
  seller_format_bottle: string;
  seller_format_pack: string;

  seller_event_details_label: string;
  seller_product_desc_label: string;
  seller_event_details_placeholder: string;
  seller_product_desc_placeholder: string;

  seller_step3_event_label: string;
  seller_event_venue_label: string;
  seller_no_active_event_alert: string;

  seller_step3_delivery_label: string;
  seller_home_delivery_option: string;
  seller_store_pickup_option: string;
  seller_select_pickup_points_label: string;
  seller_no_active_pickup_alert: string;

  seller_step4_photo_label: string;
  seller_photo_url_placeholder: string;
  seller_choose_file: string;
  seller_no_file_chosen: string;

  seller_publish_btn: string;
  seller_save_changes_btn: string;
  seller_confirm_delete_product: string;

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
    header_subtitle: 'Gaztandegia & Gourmet Hautaketa',
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
    exp_wedding_desc: 'Gazta-mahai ikusgarriak sortzen ditugu.',
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
    profile_main_title: 'Nire Profila',
    profile_main_subtitle: 'Kudeatu zure datu pertsonalak eta dendako datu partekatuak.',
    profile_personal_data: 'Datu Pertsonalak',
    profile_address_data: 'Bidalketa Helbidea',
    profile_contact_data: 'Harremanetarako Datuak',
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
    profile_status_complete: 'Profila Osatua',
    profile_status_incomplete: 'Profila Osatu Gabea',

    // Profile (extended)
    profile_tab_user: 'Erabiltzailea',
    profile_tab_store: 'Denda',
    profile_seller_data: 'Saltzailearen Datuak',
    profile_user_data: 'Erabiltzailearen Datuak',
    profile_seller_desc: 'Sarbide eta kontaktu pertsonaleko datuak (helbide eremuak ez dira derrigorrezkoak).',
    profile_full_name: 'Izen-abizenak',
    profile_town_province: 'Herria / Probintzia',
    profile_user_address: 'Erabiltzailearen Helbide Pertsonala',
    profile_seller_addr_optional: '(Aukerakoa)',
    profile_seller_no_address: 'Helbide pertsonalik gabe (ez da derrigorrezkoa)',
    profile_password_open_desc: 'Sartu uneko pasahitza eta pasahitz berria.',
    profile_password_closed_desc: 'Sakatu hemen sarbide-pasahitza aldatzeko.',
    profile_password_success: 'Pasahitza behar bezala eguneratu da!',
    profile_required_mark: '*',
    profile_optional_mark: '(Aukerakoa)',

    // Store Management (Profile -> Tienda)
    store_wa_title: 'WhatsApp Kontaktua',
    store_wa_desc: 'Webgune osoko WhatsApp aukeretarako kanal ofiziala.',
    store_wa_add_btn: 'Gehitu kontaktua',
    store_wa_alert_empty: 'Ez dago WhatsApp kontakturik erregistratuta. Mesedez, gehitu kontaktu bat.',
    store_wa_alert_no_active: 'Ez dago WhatsApp aukerarik gaituta webgunean. Mesedez, aktibatu bat.',
    store_wa_badge_active: 'Gaituta (Webgunean aktibo)',
    store_wa_badge_inactive: 'Desgaituta',
    store_btn_enable: 'Gaitu',
    store_btn_disable: 'Desgaitu',
    store_edit_contact: 'Editatu kontaktua',
    store_delete_contact: 'Ezabatu kontaktua',
    store_wa_confirm_delete: 'Ziur zaude WhatsApp kontaktu hau ezabatu nahi duzula?',
    store_config_updated_success: 'Dendaren konfigurazioa behar bezala eguneratu da.',

    store_pickup_title: 'Jasotze Puntua / Denda',
    store_pickup_desc: 'Erosleei euren eskaerak dendan jasotzeko helbideak.',
    store_pickup_add_btn: 'Gehitu Helbidea',
    store_pickup_alert_empty: 'Ez dago jasotze-punturik sartuta. Mesedez, gehitu helbide bat.',
    store_pickup_alert_no_active: 'Ez dago jasotze-puntu aktiborik. Mesedez, aktibatu gutxienez helbide bat.',
    store_pickup_confirm_delete: 'Ziur zaude jasotze helbide hau ezabatu nahi duzula?',
    store_schedule_label: 'Ordutegia:',

    store_event_title: 'Ekitaldi Puntua',
    store_event_desc: 'Dastaketa presentzialak eta ekitaldiak ospatzeko kokapenak.',
    store_event_add_btn: 'Gehitu Kokapena',
    store_event_alert_empty: 'Ez dago ekitaldi-punturik sartuta. Mesedez, gehitu kokapen bat.',
    store_event_alert_no_active: 'Ez dago ekitaldi-puntu aktiborik. Mesedez, aktibatu gutxienez kokapen bat.',
    store_event_confirm_delete: 'Ziur zaude ekitaldi-kokapen hau ezabatu nahi duzula?',
    store_notes_label: 'Oharrak:',

    // Store Modals
    store_modal_wa_edit: 'Editatu WhatsApp Kontaktua',
    store_modal_wa_new: 'Gehitu WhatsApp Kontaktua',
    store_modal_wa_source_label: 'Datuen jatorria',
    store_modal_wa_choose_seller: 'Aukeratu Saltzailea',
    store_modal_wa_manual_input: 'Eskuz sartu',
    store_modal_wa_select_seller: 'Hautatu Saltzailea *',
    store_modal_wa_name: 'Kontaktuaren Izena *',
    store_modal_wa_phone: 'Telefono Zenbakia / WhatsApp *',
    store_modal_wa_save: 'Gorde Kontaktua',

    store_modal_pickup_edit: 'Editatu Jasotze Puntua',
    store_modal_pickup_new: 'Gehitu Jasotze Puntua / Denda',
    store_modal_pickup_title_field: 'Jasotze Puntuaren Titulua *',
    store_modal_pickup_schedule_field: 'Arreta / Jasotze Ordutegia',
    store_modal_pickup_save: 'Gorde Helbidea',

    store_modal_event_edit: 'Editatu Ekitaldi Puntua',
    store_modal_event_new: 'Gehitu Ekitaldi Puntua',
    store_modal_event_title_field: 'Ekitaldiaren Kokapenaren Titulua *',
    store_modal_event_notes_field: 'Gunearen Oharrak / Baldintzak',
    store_modal_event_save: 'Gorde Kokapena',

    // Shop Section
    shop_specialty: 'Gure Espezialitatea',
    shop_hero_title: 'Gaztak eta opari gastronomikoak Lekeition',
    shop_hero_desc: 'Egileak sinatutako gaztak, Kantabriako altxorrak eta hautatutako marinadak. Lekeitioko zapore benetakoa opari eta gozatzeko.',
    shop_see_cheeses: 'GURE GAZTAK IKUSI',
    shop_whatsapp_orders: 'WhatsApp bidez eskaerak',
    shop_visit_title: 'Gure Gaztategia & Gourmet Gunea',
    shop_visit_subtitle: 'Bisitatu Lekeition · Km0',
    shop_visit_desc: 'Gure Lekeitioko gaztaterian dena duzu: 80 baino gehiago erreferentzia artisau gazta, Kantabriako kontserbak eta aholkularitza pertsonalizatua.',
    shop_visit_contact: 'Kontaktatu Dendarekin',

    // Chat
    chat_title: 'Txatak eta Mezuak',
    chat_type_message: 'Idatzi mezu bat hemen...',
    chat_send: 'Bidali',
    chat_about_product: 'Produktu honi buruz',
    chat_about_order: 'Eskaera honi buruz',
    chat_no_messages: 'Ez dago mezurik oraindik',
    chat_conversations: 'Elkarrizketak',

    // Seller Dashboard
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
    seller_events_col_buyer: 'Eroslea',
    seller_events_col_contact: 'Kontaktua',
    seller_events_col_seats: 'Lekuak',
    seller_events_col_date: 'Erosketa Data',
    seller_events_col_total: 'Guztira',
    seller_events_col_actions: 'Ekintzak',
    seller_events_badge_store: 'Dastaketa Presentziala · Lekeitioko Denda',
    seller_events_occupied_seats: 'Leku beteak:',
    seller_events_no_reservations: 'Oraindik ez dago erreserbarik erregistratuta dastaketa presentzial honetarako.',
    seller_events_open_chat_title: 'Ireki txata eroslearekin',
    seller_events_remove_participant_title: 'Eman baja parte-hartzaileari eta jakinarazi txat bidez',
    seller_events_modal_title: 'Editatu Dastaketa Presentzialaren Datuak',
    seller_events_modal_notice: 'Dastaketaren data, ordua edo baldintzetan egindako edozein aldaketa automatikoki jakinaraziko zaie txat bidez plaza erreserbatua duten parte-hartzaile guztiei.',
    seller_events_modal_name_label: 'Dastaketa Presentzialaren Titulua *',
    seller_events_modal_price_label: 'Prezioa Lekuko (€) *',
    seller_events_modal_stock_label: 'Leku Erabilgarriak *',
    seller_events_modal_location_label: 'Tokia / Kokapena *',
    seller_events_modal_desc_label: 'Deskribapena, Data/Ordua & Maridajea *',
    seller_events_modal_desc_placeholder: 'Adib: Data: Irailak 20, Larunbata · 19:30\nDastatuko diren gaztak: 5 artisau gazta eta euskal maridajea...',
    seller_events_modal_save_notify: 'Gorde eta Jakinarazi',
    seller_events_modal_saving_notify: 'Gordetzen eta jakinarazten...',
    seller_events_remove_prompt: 'Nahi duzu parte-hartzaile honi baja eman dastaketa honetan? Erreserba bertan behera geratuko da, plazak berreskuratuko dira eta jakinarazpen automatiko bat bidaliko zaio txat bidez.\n\nArrazoia (aukerakoa):',
    seller_events_edit_success: 'Dastaketa ongi aldatu da! Txat bidez jakinarazi zaie parte-hartzaileei.',

    // Seller Product Form (extended)
    seller_shared_catalog_subtitle: 'EkhiTeka saltzaile talde osoarentzako katalogo partekatua.',
    seller_last_modified_by: 'Azken aldaketa egin duena:',
    seller_step1_label: '1. Zein motatako artikulua argitaratu nahi duzu?',
    seller_type_single: 'Produktu Soltea',
    seller_type_hamper: 'Saskia / Lotea',
    seller_type_store_tasting: 'Dastaketa Presentziala',
    seller_type_home_tasting: 'Dastaketa Etxean',
    seller_type_gift_card: 'Opari Txartela',

    seller_step2_label: '2. Produktu edo Ekitaldiaren Datuak',
    seller_name_product_label: 'Produktuaren Izena *',
    seller_name_event_label: 'Ekitaldiaren / Dastaketaren Izena *',
    seller_name_placeholder_single: 'Adib: Idiazabal Gazta Ketua Artzain Egilea',
    seller_name_placeholder_hamper: 'Adib: Lekeitio Dastatze Saskia',
    seller_name_placeholder_event: 'Adib: 6 Gazta Afinatu & Txakoli Dastaketa Nagusia',

    seller_catalog_select_title: 'Gehitu Katalogo Orokorreko Produktu Solteak Hautaketa Honetara',
    seller_catalog_select_desc: 'Hautatu zerrendan produktu solte bat bere fitxa ikusteko, kantitatea zehazteko eta gehitzeko.',
    seller_catalog_no_singles: 'Ez dago produktu solterik erregistratuta katalogoan',
    seller_qty_label: 'Kantitatea:',
    seller_btn_add: 'Gehitu',

    seller_custom_product_accordion_title: 'Sartu produktu solte espezifikoak (banan-banan)',
    seller_custom_product_accordion_desc: 'Sakatu hemen inprimakia zabaldu eta hautaketa honetarako artikulu berri bat sortzeko.',
    seller_custom_photo_label: 'Produktuaren Argazkia',
    seller_custom_url_fallback: 'Edo idatzi argazkiaren zuzeneko esteka (aukerakoa)',
    seller_btn_add_to_list: 'Gehitu zerrendara',

    seller_list_items_title: 'Zerrendako produktuak',
    seller_badge_custom_item: 'Espezifikoa',
    seller_list_total_sum: 'Zerrendaren guztizko batura:',
    seller_list_empty_desc: 'Oraindik ez duzu produktu solterik gehitu zerrenda honetara.',

    seller_sale_price_label: 'Salmenta Prezioa (€) *',
    seller_price_per_seat_label: 'Prezioa Lekuko (€) *',
    seller_original_sum_helper: 'Hasierako batura soltea:',
    seller_discount_label: 'Deskontua (%)',
    seller_discount_applied_notice: 'Aplikaturiko deskontua: erosleentzat ikusgai',
    seller_discount_surcharge_notice: 'Batura soltearen gaineko errekargua (ez da erosleentzat ikusgai)',
    seller_discount_zero_notice: '0% deskontua (prezioa batura soltearen berdina)',
    seller_discount_need_items_notice: 'Gehitu produktu solteak deskontua kalkulatzeko',

    seller_stock_available_label: 'Stock Erabilgarria',
    seller_seats_capacity_label: 'Aforoa / Leku Erabilgarriak *',
    seller_unlimited_checkbox: 'Mugagabea',

    seller_format_unit: 'Unitatea / Pieza',
    seller_format_weight: 'Pisua (Kg / Zatia)',
    seller_format_jar: 'Potoa / Ontzia',
    seller_format_can: 'Kontserba Lata',
    seller_format_bottle: 'Botila',
    seller_format_pack: 'Dastatze Pack-a',

    seller_event_details_label: 'Xehetasunak, Data, Ordua & Maridajea *',
    seller_product_desc_label: 'Deskribapena, dastatze oharrak eta aurkezpena',
    seller_event_details_placeholder: 'Adib: Data: Irailak 20, Larunbata · 19:30\nIraupena: 90 minutu\n5 artzain gazta eta Bizkaiko 2 txakoli maridajearekin barne.',
    seller_product_desc_placeholder: 'Deskribatu zaporea, ontzea, usainak eta ekoizlearen historia...',

    seller_step3_event_label: '3. Ekitaldi Puntua (Kokapen bakarra)',
    seller_event_venue_label: 'Dastaketa ospatuko den gunea *',
    seller_no_active_event_alert: 'Ez dago ekitaldi-puntu aktiborik. Joan Profila > Denda atalera kokapen bat aktibatzeko.',

    seller_step3_delivery_label: '3. Bidalketa Moduak & Jasotze Puntuak Dendan',
    seller_home_delivery_option: 'Etxera Bidalketa',
    seller_store_pickup_option: 'Dendan Jasotzea',
    seller_select_pickup_points_label: 'Hautatu zein jasotze-puntutan eskaini jasotzeko aukera:',
    seller_no_active_pickup_alert: 'Ez dago jasotze-puntu aktiborik. Zure profileko Denda fitxan aktiba ditzakezu.',

    seller_step4_photo_label: '4. Produktuaren / Ekitaldiaren Argazkia',
    seller_photo_url_placeholder: 'Edo itsatsi zuzeneko irudi esteka bat (aukerakoa)',
    seller_choose_file: 'Aukeratu fitxategia',
    seller_no_file_chosen: 'Ez da fitxategirik hautatu',

    seller_publish_btn: 'Argitaratu Dendan',
    seller_save_changes_btn: 'Gorde Aldaketak',
    seller_confirm_delete_product: 'Ziur zaude produktu hau kendu nahi duzula?',

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
    header_subtitle: 'Quesería & Selección Gourmet',
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
    profile_main_title: 'Mi Perfil',
    profile_main_subtitle: 'Gestiona tus datos personales y los datos compartidos de la tienda.',
    profile_personal_data: 'Datos Personales',
    profile_address_data: 'Dirección de Entrega',
    profile_contact_data: 'Datos de Contacto',
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
    profile_status_complete: 'Perfil Completo',
    profile_status_incomplete: 'Perfil Incompleto',

    // Profile (extended)
    profile_tab_user: 'Usuario',
    profile_tab_store: 'Tienda',
    profile_seller_data: 'Datos de Vendedor',
    profile_user_data: 'Datos del Usuario',
    profile_seller_desc: 'Tus datos de acceso y contacto personales (los campos de dirección no son obligatorios).',
    profile_full_name: 'Nombre y Apellidos',
    profile_town_province: 'Municipio / Provincia',
    profile_user_address: 'Dirección Personal del Usuario',
    profile_seller_addr_optional: '(Opcional)',
    profile_seller_no_address: 'Sin dirección personal registrada (no obligatoria)',
    profile_password_open_desc: 'Introduce tu contraseña actual y la nueva clave.',
    profile_password_closed_desc: 'Pulsa aquí para cambiar tu contraseña de acceso.',
    profile_password_success: '¡Contraseña actualizada con éxito!',
    profile_required_mark: '*',
    profile_optional_mark: '(Opcional)',

    // Store Management (Profile -> Tienda)
    store_wa_title: 'Contacto WhatsApp',
    store_wa_desc: 'Canal oficial para las opciones de WhatsApp en toda la tienda web.',
    store_wa_add_btn: 'Añadir contacto',
    store_wa_alert_empty: 'No hay ningún contacto de WhatsApp registrado. Por favor, añade un contacto.',
    store_wa_alert_no_active: 'Sin opciones WhatsApp en la web. No hay ningún contacto habilitado. Por favor, activa uno.',
    store_wa_badge_active: 'Habilitado (Activo en la web)',
    store_wa_badge_inactive: 'Deshabilitado',
    store_btn_enable: 'Habilitar',
    store_btn_disable: 'Deshabilitar',
    store_edit_contact: 'Editar contacto',
    store_delete_contact: 'Borrar contacto',
    store_wa_confirm_delete: '¿Eliminar este contacto de WhatsApp?',
    store_config_updated_success: 'Configuración de tienda actualizada correctamente.',

    store_pickup_title: 'Punto entrega / tienda',
    store_pickup_desc: 'Direcciones para dar la opción de recogida a los compradores en sus pedidos.',
    store_pickup_add_btn: 'Añadir Dirección',
    store_pickup_alert_empty: 'No hay ningún punto de entrega metido. Por favor, mete una dirección.',
    store_pickup_alert_no_active: 'No hay ningún punto de entrega activo. Por favor, activa al menos una dirección.',
    store_pickup_confirm_delete: '¿Eliminar esta dirección de entrega/tienda?',
    store_schedule_label: 'Horario:',

    store_event_title: 'Punto evento',
    store_event_desc: 'Ubicaciones disponibles para la celebración de catas presenciales y eventos.',
    store_event_add_btn: 'Añadir Ubicación',
    store_event_alert_empty: 'No hay ningún punto de evento metido. Por favor, mete una dirección.',
    store_event_alert_no_active: 'No hay ningún punto de evento activo. Por favor, activa al menos una ubicación.',
    store_event_confirm_delete: '¿Eliminar este punto de evento?',
    store_notes_label: 'Notas:',

    // Store Modals
    store_modal_wa_edit: 'Editar Contacto WhatsApp',
    store_modal_wa_new: 'Añadir Contacto WhatsApp',
    store_modal_wa_source_label: 'Origen de los datos',
    store_modal_wa_choose_seller: 'Elegir Vendedor',
    store_modal_wa_manual_input: 'Meter a mano',
    store_modal_wa_select_seller: 'Seleccionar Vendedor *',
    store_modal_wa_name: 'Nombre del Contacto *',
    store_modal_wa_phone: 'Número de Teléfono / WhatsApp *',
    store_modal_wa_save: 'Guardar Contacto',

    store_modal_pickup_edit: 'Editar Punto de Entrega',
    store_modal_pickup_new: 'Añadir Punto de Entrega / Tienda',
    store_modal_pickup_title_field: 'Título del Punto de Entrega *',
    store_modal_pickup_schedule_field: 'Horario de Atención / Recogida',
    store_modal_pickup_save: 'Guardar Dirección',

    store_modal_event_edit: 'Editar Punto de Evento',
    store_modal_event_new: 'Añadir Punto de Evento',
    store_modal_event_title_field: 'Título de la Ubicación del Evento *',
    store_modal_event_notes_field: 'Notas / Condiciones del Espacio',
    store_modal_event_save: 'Guardar Ubicación',

    // Shop Section
    shop_specialty: 'Nuestra Especialidad',
    shop_hero_title: 'Quesos y regalos gastronómicos en Lekeitio',
    shop_hero_desc: 'Quesos afinados de autor, tesoros del Cantábrico y maridajes selectos. El sabor auténtico de Lekeitio para regalar y disfrutar.',
    shop_see_cheeses: 'VER NUESTROS QUESOS',
    shop_whatsapp_orders: 'Encargos por WhatsApp',
    shop_visit_title: 'Nuestra Quesería & Espacio Gourmet',
    shop_visit_subtitle: 'Visítanos en Lekeitio · Km0',
    shop_visit_desc: 'En nuestra quesería de Lekeitio lo tienes todo: más de 80 referencias de quesos artesanos afinados, conservas selectas del Cantábrico y asesoramiento personalizado.',
    shop_visit_contact: 'Contactar con la Tienda',

    // Chat
    chat_title: 'Mensajes & Asesoramiento',
    chat_type_message: 'Escribe tu mensaje aquí...',
    chat_send: 'Enviar',
    chat_about_product: 'Sobre este producto',
    chat_about_order: 'Sobre este pedido',
    chat_no_messages: 'No hay mensajes aún',
    chat_conversations: 'Conversaciones',

    // Seller Dashboard
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
    seller_events_col_buyer: 'Comprador',
    seller_events_col_contact: 'Contacto',
    seller_events_col_seats: 'Plazas',
    seller_events_col_date: 'Fecha Compra',
    seller_events_col_total: 'Total',
    seller_events_col_actions: 'Acciones',
    seller_events_badge_store: 'Cata Presencial · Tienda Lekeitio',
    seller_events_occupied_seats: 'Plazas ocupadas:',
    seller_events_no_reservations: 'Aún no hay reservas registradas para esta cata presencial.',
    seller_events_open_chat_title: 'Abrir chat con el comprador',
    seller_events_remove_participant_title: 'Dar de baja participante y notificar por chat',
    seller_events_modal_title: 'Editar Variables de la Cata Presencial',
    seller_events_modal_notice: 'Cualquier cambio en la fecha, hora o condiciones de la cata se notificará automáticamente por el chat a todos los participantes con plaza reservada.',
    seller_events_modal_name_label: 'Título de la Cata Presencial *',
    seller_events_modal_price_label: 'Precio por Plaza (€) *',
    seller_events_modal_stock_label: 'Plazas Disponibles Restantes *',
    seller_events_modal_location_label: 'Lugar / Ubicación *',
    seller_events_modal_desc_label: 'Descripción, Fecha/Hora & Maridaje *',
    seller_events_modal_desc_placeholder: 'Ej: Fecha: Sábado 20 de Septiembre · 19:30h\nQuesos a probar: 5 quesos de autor y maridaje vasco...',
    seller_events_modal_save_notify: 'Guardar y Notificar',
    seller_events_modal_saving_notify: 'Guardando & Notificando...',
    seller_events_remove_prompt: '¿Deseas dar de baja a este participante de esta cata presencial? Se cancelará la reserva, se restablecerán las plazas y se le enviará un aviso automático por chat.\n\nMotivo (opcional):',
    seller_events_edit_success: '¡Cata modificada con éxito! Se ha notificado a los participantes por el chat.',

    // Seller Product Form (extended)
    seller_shared_catalog_subtitle: 'Catálogo compartido para todo el equipo de vendedores de EkhiTeka.',
    seller_last_modified_by: 'Última modificación realizada por:',
    seller_step1_label: '1. ¿Qué tipo de artículo deseas publicar?',
    seller_type_single: 'Producto Suelto',
    seller_type_hamper: 'Cesta / Lote',
    seller_type_store_tasting: 'Cata Presencial',
    seller_type_home_tasting: 'Cata en Casa',
    seller_type_gift_card: 'Tarjeta Regalo',

    seller_step2_label: '2. Datos del Producto o Evento' ,
    seller_name_product_label: 'Nombre del Producto *',
    seller_name_event_label: 'Nombre del Evento / Cata *',
    seller_name_placeholder_single: 'Ej: Queso Idiazabal Ahumado Pastor de Autor',
    seller_name_placeholder_hamper: 'Ej: Cesta Selección Degustación Lekeitio',
    seller_name_placeholder_event: 'Ej: Cata Magistral de 6 Quesos Afinados & Txakoli',

    seller_catalog_select_title: 'Añadir Productos Sueltos del Catálogo a esta Selección',
    seller_catalog_select_desc: 'Selecciona en la lista desplegable un producto individual suelto para ver su ficha, indicar cantidad y añadirlo.',
    seller_catalog_no_singles: 'No hay productos sueltos registrados en el catálogo',
    seller_qty_label: 'Cantidad:',
    seller_btn_add: 'Añadir',

    seller_custom_product_accordion_title: 'Meter productos sueltos específicos (uno a uno)',
    seller_custom_product_accordion_desc: 'Pulsa aquí para desplegar el formulario y crear un artículo nuevo exclusivo para esta selección.',
    seller_custom_photo_label: 'Fotografía del Producto',
    seller_custom_url_fallback: 'O escribe una URL directa de imagen (opcional)',
    seller_btn_add_to_list: 'Añadir a la lista',

    seller_list_items_title: 'Productos de la lista',
    seller_badge_custom_item: 'Específico',
    seller_list_total_sum: 'Suma total de la lista:',
    seller_list_empty_desc: 'Aún no has añadido productos sueltos a esta lista.',

    seller_sale_price_label: 'Precio de Venta (€) *',
    seller_price_per_seat_label: 'Precio por Plaza (€) *',
    seller_original_sum_helper: 'Suma suelta original:',
    seller_discount_label: 'Descuento (%)',
    seller_discount_applied_notice: 'Descuento aplicado: visible para los compradores',
    seller_discount_surcharge_notice: 'Recargo sobre la suma suelta (no visible a compradores)',
    seller_discount_zero_notice: '0% de descuento (precio igual a la suma suelta)',
    seller_discount_need_items_notice: 'Añade productos sueltos para calcular descuento',

    seller_stock_available_label: 'Stock Disponible',
    seller_seats_capacity_label: 'Aforo / Plazas Disponibles *',
    seller_unlimited_checkbox: 'Ilimitado',

    seller_format_unit: 'Unidad / Pieza',
    seller_format_weight: 'Peso (Kg / Cuña)',
    seller_format_jar: 'Tarro / Bote',
    seller_format_can: 'Lata Conserva',
    seller_format_bottle: 'Botella',
    seller_format_pack: 'Pack Degustación',

    seller_event_details_label: 'Detalles, Fecha, Hora & Maridaje *',
    seller_product_desc_label: 'Descripción, notas de cata y presentación',
    seller_event_details_placeholder: 'Ej: Fecha: Sábado 20 de Septiembre · 19:30h\nDuración: 90 minutos\nIncluye 5 quesos artesanos de pastor y maridaje con 2 txakolis de Bizkaia.',
    seller_product_desc_placeholder: 'Describe el perfil de sabor, curación, aromas e historia del productor...',

    seller_step3_event_label: '3. Punto de Evento (Ubicación única)',
    seller_event_venue_label: 'Espacio donde se celebrará la cata *',
    seller_no_active_event_alert: 'No hay ningún punto de evento activo. Ve a Perfil > Tienda para activar una ubicación de eventos.',

    seller_step3_delivery_label: '3. Métodos de Entrega & Puntos de Recogida en Tienda',
    seller_home_delivery_option: 'Envío a Domicilio',
    seller_store_pickup_option: 'Recogida en tienda',
    seller_select_pickup_points_label: 'Selecciona en qué puntos de entrega/tienda dar la opción de recogida:',
    seller_no_active_pickup_alert: 'No hay puntos de entrega activos. Puedes activarlos en la pestaña Tienda de tu perfil.',

    seller_step4_photo_label: '4. Fotografía del Producto / Evento',
    seller_photo_url_placeholder: 'O pega una URL de imagen directa (opcional)',
    seller_choose_file: 'Seleccionar archivo',
    seller_no_file_chosen: 'Ningún archivo seleccionado',

    seller_publish_btn: 'Publicar en la Tienda',
    seller_save_changes_btn: 'Guardar Cambios',
    seller_confirm_delete_product: '¿Estás seguro de que deseas dar de baja este producto?',

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
    header_subtitle: 'Cheese Shop & Gourmet Selection',
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
    profile_main_title: 'My Profile',
    profile_main_subtitle: 'Manage your personal details and shared store settings.',
    profile_personal_data: 'Personal Information',
    profile_address_data: 'Shipping Address',
    profile_contact_data: 'Contact Information',
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
    profile_status_complete: 'Complete Profile',
    profile_status_incomplete: 'Incomplete Profile',

    // Profile (extended)
    profile_tab_user: 'User',
    profile_tab_store: 'Store',
    profile_seller_data: 'Seller Information',
    profile_user_data: 'User Information',
    profile_seller_desc: 'Your personal login and contact details (address fields are optional).',
    profile_full_name: 'Full Name',
    profile_town_province: 'Town / Province',
    profile_user_address: 'Personal User Address',
    profile_seller_addr_optional: '(Optional)',
    profile_seller_no_address: 'No personal address registered (optional)',
    profile_password_open_desc: 'Enter your current password and new password.',
    profile_password_closed_desc: 'Click here to change your access password.',
    profile_password_success: 'Password updated successfully!',
    profile_required_mark: '*',
    profile_optional_mark: '(Optional)',

    // Store Management (Profile -> Tienda)
    store_wa_title: 'WhatsApp Contact',
    store_wa_desc: 'Official channel for WhatsApp options across the store.',
    store_wa_add_btn: 'Add Contact',
    store_wa_alert_empty: 'No WhatsApp contact registered. Please add a contact.',
    store_wa_alert_no_active: 'No WhatsApp options on the web. No active contact. Please enable one.',
    store_wa_badge_active: 'Enabled (Active on web)',
    store_wa_badge_inactive: 'Disabled',
    store_btn_enable: 'Enable',
    store_btn_disable: 'Disable',
    store_edit_contact: 'Edit contact',
    store_delete_contact: 'Delete contact',
    store_wa_confirm_delete: 'Are you sure you want to delete this WhatsApp contact?',
    store_config_updated_success: 'Store configuration updated successfully.',

    store_pickup_title: 'Pickup Point / Store',
    store_pickup_desc: 'Addresses to offer buyers store pickup options for their orders.',
    store_pickup_add_btn: 'Add Address',
    store_pickup_alert_empty: 'No pickup points registered. Please add an address.',
    store_pickup_alert_no_active: 'No active pickup points. Please enable at least one address.',
    store_pickup_confirm_delete: 'Are you sure you want to delete this pickup address?',
    store_schedule_label: 'Hours:',

    store_event_title: 'Event Location',
    store_event_desc: 'Locations available for in-person tastings and events.',
    store_event_add_btn: 'Add Location',
    store_event_alert_empty: 'No event locations registered. Please add a location.',
    store_event_alert_no_active: 'No active event locations. Please enable at least one location.',
    store_event_confirm_delete: 'Are you sure you want to delete this event location?',
    store_notes_label: 'Notes:',

    // Store Modals
    store_modal_wa_edit: 'Edit WhatsApp Contact',
    store_modal_wa_new: 'Add WhatsApp Contact',
    store_modal_wa_source_label: 'Data source',
    store_modal_wa_choose_seller: 'Choose Seller',
    store_modal_wa_manual_input: 'Enter manually',
    store_modal_wa_select_seller: 'Select Seller *',
    store_modal_wa_name: 'Contact Name *',
    store_modal_wa_phone: 'Phone Number / WhatsApp *',
    store_modal_wa_save: 'Save Contact',

    store_modal_pickup_edit: 'Edit Pickup Point',
    store_modal_pickup_new: 'Add Pickup Point / Store',
    store_modal_pickup_title_field: 'Pickup Point Title *',
    store_modal_pickup_schedule_field: 'Opening / Pickup Hours',
    store_modal_pickup_save: 'Save Address',

    store_modal_event_edit: 'Edit Event Location',
    store_modal_event_new: 'Add Event Location',
    store_modal_event_title_field: 'Event Location Title *',
    store_modal_event_notes_field: 'Venue Notes / Conditions',
    store_modal_event_save: 'Save Location',

    // Shop Section
    shop_specialty: 'Our Speciality',
    shop_hero_title: 'Artisan cheeses & gourmet gifts in Lekeitio',
    shop_hero_desc: 'Author-aged cheeses, Cantabrian treasures and curated pairings. The authentic taste of Lekeitio to gift and enjoy.',
    shop_see_cheeses: 'SEE OUR CHEESES',
    shop_whatsapp_orders: 'Custom Orders via WhatsApp',
    shop_visit_title: 'Our Cheesemonger & Gourmet Space',
    shop_visit_subtitle: 'Visit us in Lekeitio · Km0',
    shop_visit_desc: 'Our website shows a selection, but our Lekeitio shop has it all: over 80 references of aged artisan cheeses, Cantabrian preserved fish and personalised advice.',
    shop_visit_contact: 'Contact the Shop',

    // Chat
    chat_title: 'Messages & Support',
    chat_type_message: 'Type your message here...',
    chat_send: 'Send',
    chat_about_product: 'About this item',
    chat_about_order: 'About this order',
    chat_no_messages: 'No messages yet',
    chat_conversations: 'Conversations',

    // Seller Dashboard
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
    seller_events_col_buyer: 'Buyer',
    seller_events_col_contact: 'Contact',
    seller_events_col_seats: 'Seats',
    seller_events_col_date: 'Purchase Date',
    seller_events_col_total: 'Total',
    seller_events_col_actions: 'Actions',
    seller_events_badge_store: 'In-Person Tasting · Lekeitio Shop',
    seller_events_occupied_seats: 'Occupied seats:',
    seller_events_no_reservations: 'No bookings registered yet for this in-person tasting.',
    seller_events_open_chat_title: 'Open chat with buyer',
    seller_events_remove_participant_title: 'Cancel participant and notify via chat',
    seller_events_modal_title: 'Edit In-Person Tasting Details',
    seller_events_modal_notice: 'Any change to the date, time or tasting conditions will be automatically notified via chat to all attendees with a reserved seat.',
    seller_events_modal_name_label: 'In-Person Tasting Title *',
    seller_events_modal_price_label: 'Price per Seat (€) *',
    seller_events_modal_stock_label: 'Remaining Available Seats *',
    seller_events_modal_location_label: 'Venue / Location *',
    seller_events_modal_desc_label: 'Description, Date/Time & Pairing *',
    seller_events_modal_desc_placeholder: 'e.g. Date: Saturday 20 September · 19:30\nCheeses to taste: 5 artisan cheeses with Basque pairing...',
    seller_events_modal_save_notify: 'Save & Notify',
    seller_events_modal_saving_notify: 'Saving & Notifying...',
    seller_events_remove_prompt: 'Do you want to cancel this participant from this tasting? The reservation will be cancelled, seats will be restored, and an automatic chat notice will be sent.\n\nReason (optional):',
    seller_events_edit_success: 'Tasting updated successfully! Participants have been notified via chat.',

    // Seller Product Form (extended)
    seller_shared_catalog_subtitle: 'Shared catalogue for all EkhiTeka sellers.',
    seller_last_modified_by: 'Last modified by:',
    seller_step1_label: '1. What type of item do you want to publish?',
    seller_type_single: 'Single Product',
    seller_type_hamper: 'Hamper / Pack',
    seller_type_store_tasting: 'In-Person Tasting',
    seller_type_home_tasting: 'Home Tasting',
    seller_type_gift_card: 'Gift Card',

    seller_step2_label: '2. Product or Event Details',
    seller_name_product_label: 'Product Name *',
    seller_name_event_label: 'Event / Tasting Name *',
    seller_name_placeholder_single: 'e.g. Smoked Idiazabal Artisan Shepherd Cheese',
    seller_name_placeholder_hamper: 'e.g. Lekeitio Tasting Selection Hamper',
    seller_name_placeholder_event: 'e.g. Master Tasting of 6 Aged Cheeses & Txakoli',

    seller_catalog_select_title: 'Add Single Catalogue Products to this Selection',
    seller_catalog_select_desc: 'Select a single product from the dropdown to see details, choose quantity and add it.',
    seller_catalog_no_singles: 'No single products registered in the catalogue',
    seller_qty_label: 'Quantity:',
    seller_btn_add: 'Add',

    seller_custom_product_accordion_title: 'Add specific custom single products (one by one)',
    seller_custom_product_accordion_desc: 'Click here to expand the form and create a new custom item for this selection.',
    seller_custom_photo_label: 'Product Photo',
    seller_custom_url_fallback: 'Or enter direct image URL (optional)',
    seller_btn_add_to_list: 'Add to list',

    seller_list_items_title: 'Items in the list',
    seller_badge_custom_item: 'Custom',
    seller_list_total_sum: 'List total sum:',
    seller_list_empty_desc: 'You have not added single items to this list yet.',

    seller_sale_price_label: 'Sale Price (€) *',
    seller_price_per_seat_label: 'Price per Seat (€) *',
    seller_original_sum_helper: 'Original single sum:',
    seller_discount_label: 'Discount (%)',
    seller_discount_applied_notice: 'Discount applied: visible to buyers',
    seller_discount_surcharge_notice: 'Surcharge over single sum (not visible to buyers)',
    seller_discount_zero_notice: '0% discount (price equals single sum)',
    seller_discount_need_items_notice: 'Add single items to calculate discount',

    seller_stock_available_label: 'Available Stock',
    seller_seats_capacity_label: 'Capacity / Available Seats *',
    seller_unlimited_checkbox: 'Unlimited',

    seller_format_unit: 'Unit / Piece',
    seller_format_weight: 'Weight (Kg / Wedge)',
    seller_format_jar: 'Jar',
    seller_format_can: 'Tinned / Can',
    seller_format_bottle: 'Bottle',
    seller_format_pack: 'Tasting Pack',

    seller_event_details_label: 'Details, Date, Time & Pairing *',
    seller_product_desc_label: 'Description, tasting notes and presentation',
    seller_event_details_placeholder: 'e.g. Date: Saturday 20 September · 19:30\nDuration: 90 minutes\nIncludes 5 artisan shepherd cheeses and pairing with 2 Bizkaia txakolis.',
    seller_product_desc_placeholder: 'Describe flavour profile, ageing, aromas and producer story...',

    seller_step3_event_label: '3. Event Location (Single venue)',
    seller_event_venue_label: 'Venue where tasting takes place *',
    seller_no_active_event_alert: 'No active event location. Go to Profile > Store to enable an event venue.',

    seller_step3_delivery_label: '3. Delivery Methods & In-Store Pickup Points',
    seller_home_delivery_option: 'Home Delivery',
    seller_store_pickup_option: 'Store Pickup',
    seller_select_pickup_points_label: 'Select which pickup locations will offer collection:',
    seller_no_active_pickup_alert: 'No active pickup points. You can enable them in the Store tab of your profile.',

    seller_step4_photo_label: '4. Product / Event Photo',
    seller_photo_url_placeholder: 'Or paste direct image URL (optional)',
    seller_choose_file: 'Choose file',
    seller_no_file_chosen: 'No file chosen',

    seller_publish_btn: 'Publish in Store',
    seller_save_changes_btn: 'Save Changes',
    seller_confirm_delete_product: 'Are you sure you want to remove this product?',

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
    header_subtitle: 'Fromagerie & Sélection Gourmet',
    top_refrigerated_shipping: 'Livraison réfrigérée 24/48h',
    top_custom_orders: 'Coffrets sur mesure et conseils d\'experts',
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
    nav_corporate_gifts: 'Cadeaux d\'Entreprise',
    nav_corporate_line1: 'Cadeaux',
    nav_corporate_line2: 'd\'Entreprise',
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
    prod_ask_artisan: 'Contacter l\'artisan',
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
    prod_related_subtitle: 'Recommandations de l\'affineur',
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
    home_hero_title: 'Fromages d\'Auteur & Dégustations à Lekeitio',
    home_hero_subtitle: 'Fromages d\'Auteur & Dégustations à Lekeitio',
    home_hero_desc: 'Affinage artisanal de fromages uniques et trésors du Cantabrique.',
    home_explore_btn: 'Explorer la Boutique',
    home_gourmet_gifts_btn: 'Cadeaux Gourmets',
    home_pillars_badge: 'Notre Maison · L\'Univers EkhiTeka',
    home_pillars_title: 'Découvrez Nos Univers',
    home_pillars_desc: 'Choisissez l\'expérience souhaitée.',
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
    home_card4_title: 'Cadeaux d\'Entreprise',
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
    exp_b3_title: 'Paniers Gourmets & Cadeaux d\'Entreprise',
    exp_b3_desc: 'Coffrets gastronomiques exclusifs avec emballage soigné.',
    exp_b3_btn: 'Composer un Panier sur Mesure',

    exp_hero_badge: 'Expériences Gastronomiques',
    exp_hero_title: 'Dégustations &',
    exp_hero_title_highlight: 'Expériences',
    exp_hero_desc: 'Découvrez l\'art du fromage fermier à travers nos dégustations.',
    exp_home_tasting_title: 'Dégustations à la Maison',
    exp_home_tasting_badge: 'À votre rythme',
    exp_home_tasting_desc: 'Devenez l\'hôte idéal grâce à nos kits complets.',
    exp_home_tasting_btn: 'Commander Kit à Domicile',
    exp_store_tasting_title: 'Dégustations en Boutique',
    exp_store_tasting_badge: 'En présentiel à Lekeitio',
    exp_store_tasting_desc: 'Expériences présentielles exclusives dans notre fromagerie.',
    exp_store_tasting_btn: 'Voir les Dates & Réserver',
    exp_wedding_title: 'Buffets Fromages de Mariage',
    exp_wedding_badge: 'Mariages & Événements',
    exp_wedding_desc: 'Nous créons des buffets de fromages spectaculaires.',
    exp_wedding_btn: 'Demander un Devis Mariage',
    exp_raclette_title: 'Prêt d\'Appareil à Raclette',
    exp_raclette_badge: 'Location & Pack',
    exp_raclette_desc: 'Nous vous prêtons l\'appareil traditionnel suisse professionnel.',
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
    corp_hero_title_highlight: 'd\'Entreprise',
    corp_hero_desc: 'Remerciez vos équipes avec des paniers artisanaux.',
    corp_whatsapp_btn: 'Devis Entreprise par WhatsApp',
    corp_card1_title: 'Coffrets et Paniers de Noël',
    corp_card1_desc: 'Compositions sans intermédiaires avec facture détaillée.',
    corp_card2_title: 'Dégustations Privées & Team Building',
    corp_card2_desc: 'Événements d\'équipe dans notre fromagerie à Lekeitio.',
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
    rev1_comment: 'Les fromages sont extraordinaires. Affinage缩peccable et colis frais reçu en 24h.',
    rev1_date: 'Il y a 3 jours',
    rev2_comment: 'J\'ai commandé un plateau pour un anniversaire, les invités étaient conquis.',
    rev2_date: 'Il y a 1 semaine',
    rev3_comment: 'Je commande tous les mois. L\'emballage thermique garde le produit très frais.',
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
    deliv_order_success_desc: 'L\'artisan a reçu votre commande et prépare vos productos.',
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
    orders_cancel_reason: 'Motif d\'annulation',
    orders_chat_with_buyer: 'Chat avec le client',
    orders_chat_with_seller: 'Chat avec l\'artisan',
    orders_no_orders: 'Vous n\'avez aucune commande pour le moment',
    orders_no_orders_seller: 'Aucune commande reçue pour le moment',
    orders_no_orders_seller_sub: 'Les nouvelles commandes apparaîtront ici automatiquement.',
    orders_products_label: 'Articles de la commande',
    orders_products_to_prepare: 'Articles à préparer',
    orders_purchase_date: 'Date d\'achat',
    orders_date_time: 'Date & Heure',
    orders_order_number: 'Commande :',
    orders_total_to_charge: 'Total à encaisser :',
    orders_new_status: 'Le statut de votre commande a changé :',
    orders_mark_seen: 'Marquer como lu',
    orders_client_label: 'Client',
    orders_qty_label: 'Quantité',

    status_confirm: 'Confirmer',
    status_preparing: 'En préparation',
    status_ready: 'Prête',
    status_delivered: 'Livrée',

    // Profil
    profile_title: 'Mon Profil',
    profile_subtitle: 'Gérez vos données personnelles, adresse de livraison et sécurité.',
    profile_main_title: 'Mon Profil',
    profile_main_subtitle: 'Gérez vos données personnelles et les paramètres partagés de la boutique.',
    profile_personal_data: 'Données Personnelles',
    profile_address_data: 'Adresse de Livraison',
    profile_contact_data: 'Coordonnées de Contact',
    profile_security: 'Sécurité & Changer de Mot de Passe',
    profile_first_name: 'Prénom',
    profile_last_name_1: 'Premier Nom',
    profile_last_name_2: 'Deuxième Nom',
    profile_birth_date: 'Date de Naissance',
    profile_dni: 'Numéro d\'Identité / Passeport',
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
    profile_status_complete: 'Profil Complet',
    profile_status_incomplete: 'Profil Incomplet',

    // Profile (extended)
    profile_tab_user: 'Utilisateur',
    profile_tab_store: 'Boutique',
    profile_seller_data: 'Données du Vendeur',
    profile_user_data: 'Données de l\'Utilisateur',
    profile_seller_desc: 'Vos identifiants et coordonnées personnelles (l\'adresse n\'est pas obligatoire).',
    profile_full_name: 'Nom et Prénom',
    profile_town_province: 'Ville / Département',
    profile_user_address: 'Adresse Personnelle de l\'Utilisateur',
    profile_seller_addr_optional: '(Facultatif)',
    profile_seller_no_address: 'Sans adresse personnelle enregistrée (facultatif)',
    profile_password_open_desc: 'Saisissez votre mot de passe actuel et le nouveau mot de passe.',
    profile_password_closed_desc: 'Cliquez ici pour changer votre mot de passe.',
    profile_password_success: 'Mot de passe mis à jour avec succès !',
    profile_required_mark: '*',
    profile_optional_mark: '(Facultatif)',

    // Store Management (Profile -> Tienda)
    store_wa_title: 'Contact WhatsApp',
    store_wa_desc: 'Canal officiel pour les options WhatsApp dans toute la boutique.',
    store_wa_add_btn: 'Ajouter un contact',
    store_wa_alert_empty: 'Aucun contact WhatsApp enregistré. Veuillez ajouter un contact.',
    store_wa_alert_no_active: 'Pas d\'options WhatsApp sur le site. Aucun contact activé. Veuillez en activer un.',
    store_wa_badge_active: 'Activé (Actif sur le web)',
    store_wa_badge_inactive: 'Désactivé',
    store_btn_enable: 'Activer',
    store_btn_disable: 'Désactiver',
    store_edit_contact: 'Modifier le contact',
    store_delete_contact: 'Supprimer le contact',
    store_wa_confirm_delete: 'Voulez-vous supprimer ce contact WhatsApp ?',
    store_config_updated_success: 'Configuration de la boutique mise à jour avec succès.',

    store_pickup_title: 'Point de Retrait / Boutique',
    store_pickup_desc: 'Adresses pour offrir l\'option de retrait en boutique aux acheteurs.',
    store_pickup_add_btn: 'Ajouter une Adresse',
    store_pickup_alert_empty: 'Aucun point de retrait enregistré. Veuillez ajouter une adresse.',
    store_pickup_alert_no_active: 'Aucun point de retrait actif. Veuillez activer au moins une adresse.',
    store_pickup_confirm_delete: 'Voulez-vous supprimer cette adresse de retrait ?',
    store_schedule_label: 'Horaires :',

    store_event_title: 'Lieu d\'Événement',
    store_event_desc: 'Emplacements disponibles pour les dégustations et événements.',
    store_event_add_btn: 'Ajouter un Lieu',
    store_event_alert_empty: 'Aucun lieu d\'événement enregistré. Veuillez ajouter une adresse.',
    store_event_alert_no_active: 'Aucun lieu d\'événement actif. Veuillez activer au moins un lieu.',
    store_event_confirm_delete: 'Voulez-vous supprimer ce lieu d\'événement ?',
    store_notes_label: 'Remarques :',

    // Store Modals
    store_modal_wa_edit: 'Modifier le Contact WhatsApp',
    store_modal_wa_new: 'Ajouter un Contact WhatsApp',
    store_modal_wa_source_label: 'Origine des données',
    store_modal_wa_choose_seller: 'Choisir le Vendeur',
    store_modal_wa_manual_input: 'Saisir manuellement',
    store_modal_wa_select_seller: 'Sélectionner le Vendeur *',
    store_modal_wa_name: 'Nom du Contact *',
    store_modal_wa_phone: 'Numéro de Téléphone / WhatsApp *',
    store_modal_wa_save: 'Enregistrer le Contact',

    store_modal_pickup_edit: 'Modifier le Point de Retrait',
    store_modal_pickup_new: 'Ajouter un Point de Retrait / Boutique',
    store_modal_pickup_title_field: 'Titre du Point de Retrait *',
    store_modal_pickup_schedule_field: 'Horaires d\'Ouverture / Retrait',
    store_modal_pickup_save: 'Enregistrer l\'Adresse',

    store_modal_event_edit: 'Modifier le Lieu d\'Événement',
    store_modal_event_new: 'Ajouter un Lieu d\'Événement',
    store_modal_event_title_field: 'Titre du Lieu d\'Événement *',
    store_modal_event_notes_field: 'Remarques / Conditions du Lieu',
    store_modal_event_save: 'Enregistrer le Lieu',

    // Shop Section
    shop_specialty: 'Notre Spécialité',
    shop_hero_title: 'Fromages et cadeaux gastronomiques à Lekeitio',
    shop_hero_desc: 'Fromages affinés d\'auteur, trésors du Cantabrique et accords sélectionnés. La saveur authentique de Lekeitio à offrir et à savourer.',
    shop_see_cheeses: 'VOIR NOS FROMAGES',
    shop_whatsapp_orders: 'Commandes sur WhatsApp',
    shop_visit_title: 'Notre Fromagerie & Espace Gourmet',
    shop_visit_subtitle: 'Venez nous rendre visite à Lekeitio · Km0',
    shop_visit_desc: 'Notre fromagerie de Lekeitio propose plus de 80 références de fromages artisanaux affinés, conserves du Cantabrique et conseils personnalisés.',
    shop_visit_contact: 'Contacter la Boutique',

    // Chat
    chat_title: 'Messagerie & Conseils',
    chat_type_message: 'Écrivez votre message ici...',
    chat_send: 'Envoyer',
    chat_about_product: 'À propos de cet article',
    chat_about_order: 'À propos de cette commande',
    chat_no_messages: 'Aucun message pour le moment',
    chat_conversations: 'Conversations',

    // Seller Dashboard
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
    seller_events_no_events: 'Vous n\'avez pas encore créé de dégustation en boutique',
    seller_events_no_events_desc: 'Publiez une dégustation en boutique depuis le menu supérieur pour gérer la jauge et les réservations.',
    seller_events_col_buyer: 'Acheteur',
    seller_events_col_contact: 'Contact',
    seller_events_col_seats: 'Places',
    seller_events_col_date: 'Date d\'Achat',
    seller_events_col_total: 'Total',
    seller_events_col_actions: 'Actions',
    seller_events_badge_store: 'Dégustation Présentielle · Boutique Lekeitio',
    seller_events_occupied_seats: 'Places occupées :',
    seller_events_no_reservations: 'Aucune réservation enregistrée pour cette dégustation en boutique.',
    seller_events_open_chat_title: 'Ouvrir le chat avec l\'acheteur',
    seller_events_remove_participant_title: 'Annuler le participant et notifier par chat',
    seller_events_modal_title: 'Modifier les Variables de la Dégustation',
    seller_events_modal_notice: 'Toute modification de la date, de l\'heure ou des conditions de la dégustation sera automatiquement notifiée par chat à tous les participants ayant réservé une place.',
    seller_events_modal_name_label: 'Titre de la Dégustation Présentielle *',
    seller_events_modal_price_label: 'Prix par Place (€) *',
    seller_events_modal_stock_label: 'Places Disponibles Restantes *',
    seller_events_modal_location_label: 'Lieu / Emplacement *',
    seller_events_modal_desc_label: 'Description, Date/Heure & Accords *',
    seller_events_modal_desc_placeholder: 'Ex : Date : Samedi 20 Septembre · 19h30\nFromages à déguster : 5 fromages fermiers et accords basques...',
    seller_events_modal_save_notify: 'Enregistrer et Notifier',
    seller_events_modal_saving_notify: 'Enregistrement et notification...',
    seller_events_remove_prompt: 'Souhaitez-vous annuler l\'inscription de ce participant à cette dégustation ? La réservation sera annulée, les places seront rétablies et une notification automatique lui sera envoyée par chat.\n\nMotif (facultatif) :',
    seller_events_edit_success: 'Dégustation modifiée avec succès ! Les participants ont été informés par chat.',

    // Seller Product Form (extended)
    seller_shared_catalog_subtitle: 'Catalogue partagé pour tous les vendeurs d\'EkhiTeka.',
    seller_last_modified_by: 'Dernière modification par :',
    seller_step1_label: '1. Quel type d\'article souhaitez-vous publier ?',
    seller_type_single: 'Produit Unitaire',
    seller_type_hamper: 'Panier / Coffret',
    seller_type_store_tasting: 'Dégustation Présentielle',
    seller_type_home_tasting: 'Dégustation à Domicile',
    seller_type_gift_card: 'Carte Cadeau',

    seller_step2_label: '2. Informations sur le Produit ou l\'Événement',
    seller_name_product_label: 'Nom du Produit *',
    seller_name_event_label: 'Nom de l\'Événement / Dégustation *',
    seller_name_placeholder_single: 'Ex : Fromage Idiazabal Fumé Fermier d\'Auteur',
    seller_name_placeholder_hamper: 'Ex : Coffret Dégustation Sélection Lekeitio',
    seller_name_placeholder_event: 'Ex : Grande Dégustation de 6 Fromages Affinés & Txakoli',

    seller_catalog_select_title: 'Ajouter des Produits Individuels du Catalogue à cette Sélection',
    seller_catalog_select_desc: 'Sélectionnez un produit individuel dans la liste pour voir sa fiche, indiquer la quantité et l\'ajouter.',
    seller_catalog_no_singles: 'Aucun produit individuel enregistré dans le catalogue',
    seller_qty_label: 'Quantité :',
    seller_btn_add: 'Ajouter',

    seller_custom_product_accordion_title: 'Ajouter des produits spécifiques personnalisés (un par un)',
    seller_custom_product_accordion_desc: 'Cliquez ici pour afficher le formulaire et créer un nouvel article exclusif à cette sélection.',
    seller_custom_photo_label: 'Photo du Produit',
    seller_custom_url_fallback: 'Ou saisissez une URL d\'image directe (facultatif)',
    seller_btn_add_to_list: 'Ajouter à la liste',

    seller_list_items_title: 'Produits de la liste',
    seller_badge_custom_item: 'Spécifique',
    seller_list_total_sum: 'Somme totale de la liste :',
    seller_list_empty_desc: 'Vous n\'avez pas encore ajouté de produits unitaires à cette liste.',

    seller_sale_price_label: 'Prix de Vente (€) *',
    seller_price_per_seat_label: 'Prix par Place (€) *',
    seller_original_sum_helper: 'Somme unitaire d\'origine :',
    seller_discount_label: 'Remise (%)',
    seller_discount_applied_notice: 'Remise appliquée : visible par les acheteurs',
    seller_discount_surcharge_notice: 'Majoration sur la somme unitaire (non visible par les acheteurs)',
    seller_discount_zero_notice: '0% de remise (prix égal à la somme unitaire)',
    seller_discount_need_items_notice: 'Ajoutez des produits unitaires pour calculer la remise',

    seller_stock_available_label: 'Stock Disponible',
    seller_seats_capacity_label: 'Jauge / Places Disponibles *',
    seller_unlimited_checkbox: 'Illimité',

    seller_format_unit: 'Unité / Pièce',
    seller_format_weight: 'Poids (Kg / Portion)',
    seller_format_jar: 'Bocal / Pot',
    seller_format_can: 'Boîte de conserve',
    seller_format_bottle: 'Bouteille',
    seller_format_pack: 'Pack Dégustation',

    seller_event_details_label: 'Détails, Date, Heure & Accords *',
    seller_product_desc_label: 'Description, notes de dégustation et présentation',
    seller_event_details_placeholder: 'Ex : Date : Samedi 20 Septembre · 19h30\nDurée : 90 minutes\nComprend 5 fromages fermiers et accord avec 2 vins txakoli de Bizkaia.',
    seller_product_desc_placeholder: 'Décrivez le profil aromatique, l\'affinage et l\'histoire du producteur...',

    seller_step3_event_label: '3. Lieu de l\'Événement (Emplacement unique)',
    seller_event_venue_label: 'Lieu où se déroulera la dégustation *',
    seller_no_active_event_alert: 'Aucun lieu d\'événement actif. Allez dans Profil > Boutique pour activer un lieu.',

    seller_step3_delivery_label: '3. Modes de Livraison & Points de Retrait en Boutique',
    seller_home_delivery_option: 'Livraison à Domicile',
    seller_store_pickup_option: 'Retrait en boutique',
    seller_select_pickup_points_label: 'Sélectionnez les points de retrait proposant cette option :',
    seller_no_active_pickup_alert: 'Aucun point de retrait actif. Vous pouvez les activer dans l\'onglet Boutique de votre profil.',

    seller_step4_photo_label: '4. Photo du Produit / Événement',
    seller_photo_url_placeholder: 'Ou collez une URL d\'image directe (facultatif)',
    seller_choose_file: 'Choisir un fichier',
    seller_no_file_chosen: 'Aucun fichier sélectionné',

    seller_publish_btn: 'Publier dans la Boutique',
    seller_save_changes_btn: 'Enregistrer les Modifications',
    seller_confirm_delete_product: 'Êtes-vous sûr de vouloir supprimer ce produit ?',

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
    footer_club_subtitle: 'Vous souhaitez rester informé des actualités d\'EkhiTeka ?',
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
