import React from "react";

const reviews = [
  {
    id: 1,
    message:
      "Outstanding service and professional team. They delivered our project on time with excellent quality.",
    name: "John Smith",
    role: "CEO, TechCorp",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    message:
      "Highly recommended! The UI/UX design exceeded our expectations.",
    name: "Sarah Johnson",
    role: "Founder, StartupX",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  }, 
  {
    id: 3,
    message:
      "Professional, creative, and responsive. Great experience working together.",
    name: "Michael Lee",
    role: "Manager, WebSolutions",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

function About() {
  return (
    <div className="min-h-screen py-16 ">
      <div className="mx-auto">

        {/* ===== About Section ===== */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About Our Company
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              We are a passionate team dedicated to building modern,
              high-quality web applications. Our mission is to deliver
              scalable, secure, and user-friendly digital solutions that help
              businesses grow faster.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              With years of experience in React, Node.js, and full-stack
              development, we focus on clean design, performance optimization,
              and customer satisfaction.
            </p>
          </div>

          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Team working"
              className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* ===== Client Reviews Section ===== */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Our Clients Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              >
                <p className="text-gray-600 mb-6">“{review.message}”</p>

                {/* Client Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {review.name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;