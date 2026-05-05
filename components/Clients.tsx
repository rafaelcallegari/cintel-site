export default function Clients() {
  const clients = [
    { name: "HBR", logo: "/images/Clientes/HBR.png" },
    { name: "J. Bianchi", logo: "/images/Clientes/J_Bianchi.png" },
    { name: "Oscar Calçados", logo: "/images/Clientes/oscar_calcados.png" },
  ];

  return (
    <section className="w-full bg-white py-16 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-2xl font-bold uppercase tracking-widest text-cintelYellow mb-14">
          Empresas que confiam na Cintel
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 pr-16">
          {clients.map((client) => (
            <div
              key={client.name}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-40 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}