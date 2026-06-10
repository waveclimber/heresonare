export default function Products({ content, language }: any) {
  const products = [
    {
      title: content[language].product1Title,
      text: content[language].product1Text,
    },
    {
      title: content[language].product2Title,
      text: content[language].product2Text,
    },
    {
      title: content[language].product3Title,
      text: content[language].product3Text,
    },
  ];

  return (
    <section id="products" className="mx-auto max-w-6xl px-6 py-32">
      <h2 className="text-4xl font-bold">
        {content[language].productsTitle}
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)] hover:bg-white/10 hover:shadow-[0_0_30px_rgba(14,108,178,0.35)]"
          >
            <h3 className="text-xl font-semibold">{product.title}</h3>

            <p className="mt-4 text-gray-400">{product.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
