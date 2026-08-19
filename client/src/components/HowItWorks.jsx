import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Ask Your Question",
    desc: "Type or speak your question in English or Urdu — Nova understands both.",
    icon: "🎤",
  },
  {
    number: "02",
    title: "Nova Explains",
    desc: "Get a clear, step-by-step explanation with simple examples, spoken out loud.",
    icon: "🤖",
  },
  {
    number: "03",
    title: "Practice & Learn",
    desc: "Reinforce your understanding with quizzes, coding exercises, and real examples.",
    icon: "📝",
  },
  {
    number: "04",
    title: "Track Your Progress",
    desc: "See your completed lessons, quiz scores, and earned certificates over time.",
    icon: "📊",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-slate-900 pt-8 pb-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            How <span className="text-indigo-400">Nova</span> Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Learning Computer Science has never been this simple — just ask,
            listen, and grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <span className="absolute top-6 right-6 text-3xl font-bold text-white/10">
                {step.number}
              </span>
              <h3 className="text-white font-semibold text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
