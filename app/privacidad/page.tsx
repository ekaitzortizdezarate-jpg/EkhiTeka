export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8 font-serif">
      <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100">
        Política de Privacidad / Pribatutasun Politika
      </h1>
      <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
        <p>
          De conformidad con el RGPD y la LOPD-GDD, los datos personales recabados a través de los formularios de registro y checkout se tratarán exclusivamente para gestionar los pedidos, entregas y notificaciones relativas a catas y reservas.
        </p>
        <p>
          Nunca compartimos tus datos con terceros salvo los necesarios para la entrega logística en transporte refrigerado.
        </p>
      </div>
    </div>
  );
}