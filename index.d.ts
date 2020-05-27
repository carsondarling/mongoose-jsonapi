import * as jsonapiSerializer from "jsonapi-serializer";
import { Schema } from "mongoose";

export type Options = {
  name: string,
  serializer?: jsonapiSerializer.SerializerOptions,
  deserializer?: jsonapiSerializer.DeserializerOptions
};

export type JSONAPI = typeof jsonapiSerializer;

export default function (schema: Schema, options: Options): void;
