import React from "react";
import { Composition } from "remotion";
import { WeekRecap, weekRecapSchema } from "./WeekRecap";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WeekRecap"
      component={WeekRecap}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1080}
      schema={weekRecapSchema}
      defaultProps={{
        week: 8,
        name: "Amara",
        babySize: "the size of a raspberry 🍓",
        stage: "Curled and growing",
        image: "baby/dev-06.jpg",
        affirmation: "My body is wise, and my baby is growing exactly as they should.",
        trimester: "first",
      }}
    />
  );
};
