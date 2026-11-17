import { useTranslation } from 'react-i18next';
import { formatMoney } from '@/api/catalog';

export default function ProductTitle({ name, startingPrice, installment }: {
  name: string; startingPrice: string; installment?: string | null;
}) {
  const { t } = useTranslation();
  return <div>
    <h4 className="text-4xl mt-2">{t('catalog.buy', { name })}</h4>
    <p className="mt-6">
      {installment != null && <>{t('catalog.installment', { price: formatMoney(installment) })} </>}
      {t('catalog.from', { price: formatMoney(startingPrice) })}
    </p>
  </div>;
}
