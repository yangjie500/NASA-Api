import mongoose from "mongoose";

interface IPlanet {
  keplerName: string;
}

const planetsSchema = new mongoose.Schema<IPlanet>({
  keplerName: {
    type: String,
    required: true
  }
});

const planets = mongoose.model<IPlanet>('Planet', planetsSchema);

export default planets;