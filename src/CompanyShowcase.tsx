
const acquiredHouses = [
  { name: 'House 01', location: 'Location to be added', image: '/images/acquired-houses/house-01.jpg' },
  { name: 'House 02', location: 'Location to be added', image: '/images/acquired-houses/house-02.jpg' },
  { name: 'House 03', location: 'Location to be added', image: '/images/acquired-houses/house-03.jpg' },
];

const investors = [
  { name: 'Investor profile coming soon', image: '/images/investors/investor-01.jpg' },
  { name: 'Investor profile coming soon', image: '/images/investors/investor-02.jpg' },
  { name: 'Investor profile coming soon', image: '/images/investors/investor-03.jpg' },
];

export default function CompanyShowcase() {
  return (
    <>
      <section id="acquisitions" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm uppercase tracking-widest text-amber-700">
            Our property journey
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-slate-900">
            Houses Bought by GO EXPRESS
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Explore homes acquired by GO EXPRESS. Property photographs and
            verified details will be added as each acquisition is documented.
          </p>

          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {acquiredHouses.map((house) => (
              <article key={house.name} className="overflow-hidden border bg-white shadow-sm">
                <img
                  src={house.image}
                  alt={house.name}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <span className="text-xs font-bold tracking-wider text-amber-700">
                    BOUGHT BY GO EXPRESS
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{house.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{house.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="investors" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm uppercase tracking-widest text-amber-400">
            Built on partnership
          </p>
          <h2 className="mt-3 text-4xl font-semibold">Our Investors</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Meet the people behind our investment journey. Investor profiles
            will be published with their permission and verified details.
          </p>

          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {investors.map((investor, index) => (
              <article key={index} className="overflow-hidden bg-slate-800">
                <img
                  src={investor.image}
                  alt="Investor profile"
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{investor.name}</h3>
                </div>
              </article>
            ))}
          </div>

          <a
            href="mailto:goexpressadmin@gmail.com?subject=GO%20EXPRESS%20Investor%20Enquiry"
            className="mt-8 inline-block bg-amber-500 px-6 py-3 font-semibold text-slate-950"
          >
            Investor Enquiries
          </a>
        </div>
      </section>
    </>
  );
}
