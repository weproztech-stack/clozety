import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

const BentoFeatures = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-sm tracking-widest uppercase text-zinc-500 font-medium mb-3">
                        The Clozety Difference
                    </h2>
                    <h3 className="text-4xl font-serif text-zinc-900 mb-4">
                        Crafted for the Modern Wardrobe
                    </h3>
                    <p className="text-lg text-zinc-600">
                        We believe in quality without compromise, ethical sourcing, and delivering an exceptional shopping experience from start to finish.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">

                    {/* Main Large Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-2 md:row-span-2 rounded-3xl bg-zinc-50 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200"
                            alt="Sustainable Fashion"
                            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 p-8 sm:p-12 z-20">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-3xl font-serif text-white mb-3">Conscious Materials</h4>
                            <p className="text-zinc-200 max-w-md">Our commitment to sustainable fashion means sourcing materials that are kind to the environment, without sacrificing luxury.</p>
                        </div>
                    </motion.div>

                    {/* Small Box 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="rounded-3xl bg-zinc-900 p-8 text-white relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800 rounded-bl-full opacity-50 transition-transform group-hover:scale-110" />
                        <div className="relative z-10">
                            <Truck className="w-8 h-8 mb-4 text-zinc-300" />
                            <h4 className="text-xl font-serif mb-2">Complimentary Shipping</h4>
                            <p className="text-zinc-400 text-sm">On all premium collection orders above ₹999.</p>
                        </div>
                    </motion.div>

                    {/* Small Box 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="rounded-3xl bg-zinc-100 p-8 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white rounded-tl-full opacity-50 transition-transform group-hover:scale-110" />
                        <div className="relative z-10">
                            <ShieldCheck className="w-8 h-8 mb-4 text-zinc-900" />
                            <h4 className="text-xl font-serif text-zinc-900 mb-2">Authenticity Guaranteed</h4>
                            <p className="text-zinc-600 text-sm">Every piece is verified for impeccable quality.</p>
                        </div>
                    </motion.div>

                    {/* Wide Box Bottom */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="md:col-span-3 rounded-3xl bg-zinc-50 p-8 sm:p-12 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 group hover:border-zinc-300 transition-colors"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-zinc-900" />
                                <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">Member Exclusive</span>
                            </div>
                            <h4 className="text-2xl font-serif text-zinc-900 mb-2">Join the Inner Circle</h4>
                            <p className="text-zinc-600">Unlock early access to sales, personalized styling tips, and VIP rewards.</p>
                        </div>
                        <Link to="/register" className="inline-flex items-center justify-center whitespace-nowrap px-8 py-4 bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors rounded-full">
                            Sign Up Now
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default BentoFeatures;
