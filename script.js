document.addEventListener('DOMContentLoaded', () => {
    const exerciseList = document.getElementById('exercise-list');
    const addExerciseBtn = document.getElementById('add-exercise-btn');
    const newExerciseNameInput = document.getElementById('new-exercise-name');
    const exerciseListContainer = document.getElementById('exercise-list-container');
    const workoutContainer = document.getElementById('workout-container');
    const currentExerciseTitle = document.getElementById('current-exercise');
    const startWorkoutBtn = document.getElementById('start-workout-btn');
    const stopWorkoutBtn = document.getElementById('stop-workout-btn');
    const statusDisplay = document.getElementById('status');
    const repsInput = document.getElementById('reps');
    const setsInput = document.getElementById('sets');
    const holdTimeInput = document.getElementById('hold-time');
    const restTimeInput = document.getElementById('rest-time');

    let exercises = [
        'Pelvic Tilts',
        'Glute Bridges',
        'Plank',
        'Bird-Dog',
        'Dead Bug'
    ];

    let currentWorkout = null;
    const synth = window.speechSynthesis;

    function speak(text) {
        if (synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.onend = function (event) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }
        synth.speak(utterThis);
    }

    function renderExercises() {
        exerciseList.innerHTML = '';
        exercises.forEach(exercise => {
            const li = document.createElement('li');
            li.textContent = exercise;
            li.addEventListener('click', () => selectExercise(exercise));
            exerciseList.appendChild(li);
        });
    }

    function addExercise() {
        const newExercise = newExerciseNameInput.value.trim();
        if (newExercise && !exercises.includes(newExercise)) {
            exercises.push(newExercise);
            renderExercises();
            newExerciseNameInput.value = '';
        }
    }

    function selectExercise(exerciseName) {
        exerciseListContainer.classList.add('hidden');
        workoutContainer.classList.remove('hidden');
        currentExerciseTitle.textContent = exerciseName;
    }

    function startWorkout() {
        const reps = parseInt(repsInput.value);
        const sets = parseInt(setsInput.value);
        const holdTime = parseInt(holdTimeInput.value);
        const restTime = parseInt(restTimeInput.value);
        const exerciseName = currentExerciseTitle.textContent;

        startWorkoutBtn.classList.add('hidden');
        stopWorkoutBtn.classList.remove('hidden');

        runWorkout(exerciseName, sets, reps, holdTime, restTime);
    }

    function stopWorkout() {
        if (currentWorkout) {
            clearTimeout(currentWorkout);
            currentWorkout = null;
        }
        statusDisplay.textContent = 'Workout Stopped.';
        speak('Workout stopped.');
        startWorkoutBtn.classList.remove('hidden');
        stopWorkoutBtn.classList.add('hidden');
        // Show exercise list again
        workoutContainer.classList.add('hidden');
        exerciseListContainer.classList.remove('hidden');
    }

    async function runWorkout(exercise, sets, reps, hold, rest) {
        for (let set = 1; set <= sets; set++) {
            statusDisplay.textContent = `Set ${set} of ${sets}`;
            speak(`Set ${set}`);
            await delay(1000);

            for (let rep = 1; rep <= reps; rep++) {
                statusDisplay.textContent = `Rep ${rep}`;
                speak(`Rep ${rep}`);
                await delay(1000);

                if (hold > 0) {
                    speak('Hold');
                    await countdown(hold, 'Holding...');
                }
                 if (rep < reps) {
                    speak('Rest');
                    await countdown(1, 'Resting...'); // Short rest between reps
                }
            }

            if (set < sets) {
                speak('Set complete. Rest.');
                await countdown(rest, 'Resting...');
            }
        }
        statusDisplay.textContent = 'Workout Complete!';
        speak('Workout complete.');
        stopWorkout();
    }

    function countdown(seconds, message) {
        return new Promise(resolve => {
            let count = seconds;
            const interval = setInterval(() => {
                statusDisplay.textContent = `${message} ${count}`;
                speak(count);
                count--;
                if (count < 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
             currentWorkout = interval;
        });
    }

    function delay(ms) {
        return new Promise(resolve => {
           const timeout = setTimeout(resolve, ms)
           currentWorkout = timeout;
        });
    }


    addExerciseBtn.addEventListener('click', addExercise);
    startWorkoutBtn.addEventListener('click', startWorkout);
    stopWorkoutBtn.addEventListener('click', stopWorkout);

    renderExercises();
});
