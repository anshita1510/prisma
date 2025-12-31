"use client";

export default function MobileAppSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            One HR app, embraced by modern teams
          </h2>
          <p className="mb-10 text-lg text-gray-600">
            Everything employees and managers need, right from their mobile phone.
          </p>

          {/* Mobile App Image */}
          <div className="flex justify-center">
            <img
              src="https://hipparillo.com/wp-content/uploads/2023/12/Group-21.png"
              alt="Mobile app preview"
              className="w-[280px] drop-shadow-2xl sm:w-[320px] lg:w-[360px]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          <Feature
            title="Simplified leave & attendance"
            desc="Clock in or apply leave from anywhere."
          />
          <Feature
            title="Tax & Expense in 2 clicks"
            desc="Manage taxes and expenses effortlessly."
          />
          <Feature
            title="Culture of recognition"
            desc="Encourage appreciation across teams."
          />
          <Feature
            title="Approvals in one place"
            desc="Approve requests from a single screen."
          />
          <Feature
            title="Personalized experience"
            desc="Employees see what matters most."
          />
          <Feature
            title="Faster issue resolution"
            desc="Built-in helpdesk for quick support."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-xl border border-gray-100 p-6 transition hover:shadow-md">
      <h4 className="mb-2 text-lg font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
