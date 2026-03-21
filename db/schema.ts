import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const exercises = pgTable('exercises', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workouts = pgTable('workouts', {
  id:          uuid('id').primaryKey().defaultRandom(),
  user_id:     text('user_id').notNull(),
  name:        text('name'),
  startedAt:   timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
});

export const workout_exercises = pgTable('workout_exercises', {
  id:          uuid('id').primaryKey().defaultRandom(),
  workout_id:  uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exercise_id: uuid('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  order:       integer('order').notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

export const sets = pgTable('sets', {
  id:                  uuid('id').primaryKey().defaultRandom(),
  workout_exercise_id: uuid('workout_exercise_id').notNull().references(() => workout_exercises.id, { onDelete: 'cascade' }),
  set_number:          integer('set_number').notNull(),
  reps:                integer('reps'),
  weight:              real('weight'),
  durationSeconds:     integer('duration_seconds'),
  createdAt:           timestamp('created_at').defaultNow().notNull(),
});

// Relations (for Drizzle query API)
export const workoutsRelations = relations(workouts, ({ many }) => ({
  workout_exercises: many(workout_exercises),
}));

export const workout_exercisesRelations = relations(workout_exercises, ({ one, many }) => ({
  workout:  one(workouts,   { fields: [workout_exercises.workout_id],  references: [workouts.id] }),
  exercise: one(exercises,  { fields: [workout_exercises.exercise_id], references: [exercises.id] }),
  sets:     many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workout_exercise: one(workout_exercises, { fields: [sets.workout_exercise_id], references: [workout_exercises.id] }),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workout_exercises: many(workout_exercises),
}));
