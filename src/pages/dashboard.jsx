import * as THREE from "three";
import { useEffect, useRef, useState} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";

// import CanvasLoader from "./Loader";

const GOLDENRATIO = 1.61803398875;

function Frames({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef();
  const clicked = useRef();
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO /2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0.5, 5.5);
      q.identity();
    }
  });
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });
  return (
    <group
      ref={ref}
      onClick={(e) => (
        e.stopPropagation(),
        setLocation(
          clicked.current === e.object ? "/" : "/item/" + e.object.name
        )
      )}
      onPointerMissed={() => setLocation("/")}
    >
      {images.map(
        (props) => <Frame key={props.id} {...props} /> /* prettier-ignore */
      )}
    </group>
  );
}

function Frame({
  id,
  url,
  song_name,
  artist,
  c = new THREE.Color(),
  ...props
}) {
  const image = useRef();
  const frame = useRef();
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = song_name.replace(/\W/g, "");
  const isActive = params?.id === name;
  useCursor(hovered);
  useFrame((state, dt) => {
      image.current.material.zoom = 1.05 + Math.sin(rnd  * 1000 + state.clock.elapsedTime * 2 )/20
    // image.current.position.y = 0
    easing.damp3(
      image.current.scale,
      [
        0.85 * (isActive && hovered ? 0.95 : 1),
        0.85 * (isActive && hovered ? 0.95 : 1),
        1,
      ],
      0.1,
      dt
    );

    easing.damp3(
      image.current.scale,
      [
        0.8 * (!isActive && hovered ? 0.85 : 1),
        0.8 * (!isActive && hovered ? 0.905 : 1),
        1,
      ],
      0.1,
      dt
    );
    //   easing.damp3(frame.current.scale, [1.1 * (!isActive && hovered ? 0.85 : 1), 1.1 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)

    //   easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
  });
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1.1, 1.1, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          url={url}
        />
      </mesh>
      <Text
        maxWidth={2}
        anchorX="center"
        anchorY="top"
        position={[0, 1.55, 0]}
        fontSize={0.09}
      >
        {song_name}
      </Text>
      <Text
        maxWidth={2}
        anchorX="center"
        anchorY="top"
        position={[0, 1.45, 0]}
        fontSize={0.06}
      >
        {artist}
      </Text>
    </group>
  );
}

const Dashboard = ({ data }) => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 80, position: [0, 2, 20] }}>
      {/* <Suspense fallback={<CanvasLoader />}> */}
      <color attach="background" args={["#191920"]} />
      <fog attach="fog" args={["#191920", 0, 15]} />
      <group position={[0, -0.5, 0]}>
        <Frames images={data} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh>
      </group>
      
      <Environment preset="city" />
      {/* </Suspense> */}
    </Canvas>
  );
};

export default Dashboard;
