import { DatabaseService } from '../services/databaseService';
import { hikingPrograms, trekkingPrograms, wildlifePrograms } from '../data/tourPrograms';

const seedTourPrograms = async () => {
  console.log('🌱 Seeding tour programs into database...');

  try {
    let totalPrograms = 0;

    // Seed hiking programs
    console.log('🥾 Adding hiking tour programs...');
    for (const [tourId, program] of Object.entries(hikingPrograms)) {
      for (let dayIndex = 0; dayIndex < program.length; dayIndex++) {
        const dayProgram = program[dayIndex];
        await DatabaseService.createTourProgram({
          tour_id: parseInt(tourId),
          day_number: dayIndex + 1,
          day_title: dayProgram.title,
          day_overview: dayProgram.overview,
          difficulty: dayProgram.difficulty,
          elevation: dayProgram.elevation,
          distance: dayProgram.distance,
          activities: dayProgram.activities,
          highlights: dayProgram.highlights,
          meals: dayProgram.meals,
          accommodation: dayProgram.accommodation
        });
        totalPrograms++;
      }
      console.log(`✅ Added program for hiking tour ${tourId} (${program.length} days)`);
    }

    // Seed trekking programs
    console.log('🏔️ Adding trekking tour programs...');
    for (const [tourId, program] of Object.entries(trekkingPrograms)) {
      for (let dayIndex = 0; dayIndex < program.length; dayIndex++) {
        const dayProgram = program[dayIndex];
        await DatabaseService.createTourProgram({
          tour_id: parseInt(tourId),
          day_number: dayIndex + 1,
          day_title: dayProgram.title,
          day_overview: dayProgram.overview,
          difficulty: dayProgram.difficulty,
          elevation: dayProgram.elevation,
          distance: dayProgram.distance,
          activities: dayProgram.activities,
          highlights: dayProgram.highlights,
          meals: dayProgram.meals,
          accommodation: dayProgram.accommodation
        });
        totalPrograms++;
      }
      console.log(`✅ Added program for trekking tour ${tourId} (${program.length} days)`);
    }

    // Seed wildlife programs
    console.log('🐾 Adding wildlife tour programs...');
    for (const [tourId, program] of Object.entries(wildlifePrograms)) {
      for (let dayIndex = 0; dayIndex < program.length; dayIndex++) {
        const dayProgram = program[dayIndex];
        await DatabaseService.createTourProgram({
          tour_id: parseInt(tourId),
          day_number: dayIndex + 1,
          day_title: dayProgram.title,
          day_overview: dayProgram.overview,
          difficulty: dayProgram.difficulty,
          elevation: dayProgram.elevation,
          distance: dayProgram.distance,
          activities: dayProgram.activities,
          highlights: dayProgram.highlights,
          meals: dayProgram.meals,
          accommodation: dayProgram.accommodation
        });
        totalPrograms++;
      }
      console.log(`✅ Added program for wildlife tour ${tourId} (${program.length} days)`);
    }

    console.log('🎉 Tour programs seeding completed successfully!');
    console.log(`📊 Added ${totalPrograms} tour program days`);
    
  } catch (error) {
    console.error('❌ Tour programs seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
};

seedTourPrograms();
