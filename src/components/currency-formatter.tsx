import React from "react";

interface CurrencyFormatterProps {
  value: number;
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({ value }) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return <span>{formatter.format(value)}</span>;
};

export default CurrencyFormatter;
