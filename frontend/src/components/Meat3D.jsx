import React, { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, Center } from "@react-three/drei"
import { motion } from "framer-motion"

// This is the model component
function BeefModel() {
  const { scene } = useGLTF("/models/beef.glb")
  return <primitive object={scene} scale={15} />
}

// This is the loading message component
function Loader() {
  return (
    <Html center>
      <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 shadow-xl">
        <p className="text-white text-lg font-bold tracking-wide drop-shadow-md animate-pulse">
          🔥 Looking for a delicious meat?
        </p>
      </div>
    </Html>
  );
}

export default function Meat3D() {
  const [isLoading, setIsLoading] = useState(true);

  // This effect will run every time you visit the page
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 750); // Show loader for 0.75 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-[32rem]"
    >
      <Canvas camera={{ position: [3, 2, 6], fov: 45 }}>
        {/* ✨ This is the key change. We are now deciding what to show INSIDE the Canvas. ✨ */}
        {isLoading ? (
          // If the page is loading, show only the Loader.
          <Loader />
        ) : (
          // If loading is finished, show the full 3D scene.
          <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <Suspense fallback={<Loader />}>
              <Center>
                <BeefModel />
              </Center>
            </Suspense>
            <OrbitControls
              autoRotate
              autoRotateSpeed={1}
              enableDamping
              dampingFactor={0.05}
              target={[0, 0.6, 0]}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 3}
            />
          </>
        )}
      </Canvas>
    </motion.div>
  )
}