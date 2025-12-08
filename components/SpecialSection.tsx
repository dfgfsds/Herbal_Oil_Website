import { Truck, RotateCw, ShieldCheck, Headphones } from 'lucide-react';

const features = [
  {
    icon: <Truck className="text-[#b39e49] w-10 h-10" />,
    title: 'Worldwide Shipping',
    description: 'Enjoy free delivery on every order.',
  },
  {
    icon: <RotateCw className="text-[#b39e49] w-10 h-10" />,
    title: 'Money-Back Guarantee',
    description: '30-day money back guarantee.',
  },
  {
    icon: <ShieldCheck className="text-[#b39e49] w-10 h-10" />,
    title: 'Secure Payments',
    description: 'Secure checkout verified',
  },
  {
    icon: <Headphones className="text-[#b39e49] w-10 h-10" />,
    title: 'Online Customer Service',
    description: (
      <>
        Call our expert <span className="text-[#b39e49] font-semibold">+91-8754698094</span>
      </>
    ),
  },
];

export default function SpecialSection() {
  return (
    <div className="bg-[#f7f9fc] py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center border-r last:border-none border-gray-200 px-4"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h4 className="font-semibold text-lg text-black">{feature.title}</h4>
            <p className="text-gray-500 text-sm mt-1">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
