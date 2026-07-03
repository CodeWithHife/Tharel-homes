// import { featuredProperties } from "../data/properties";
// import PropertyCard from "./PropertyCard";

// export default function FeaturedProperties() {
//   return (
//     <section className="py-16 px-5 bg-slate-50">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-2xl md:text-4xl font-extrabold text-[#1A1A1A] text-center mb-2.5">
//           Featured Properties
//         </h2>
//         <p className="text-center text-slate-500 mb-10">
//           Hand-picked listings trusted by our clients
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
//           {featuredProperties.map(function (property) {
//             return (
//               <div key={property.id} className="max-w-[360px] mx-auto w-full">
//                 <PropertyCard property={property} />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }