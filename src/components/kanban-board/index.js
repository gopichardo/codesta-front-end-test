import React from "react";
import "./index.css"


export default function KanbanBoard(props) {

	let [tasks, setTasks] = React.useState([
		{ name: '1', stage: 0 },
		{ name: '2', stage: 0 },
	])

	let [stagesNames] = React.useState(['Backlog', 'To Do', 'Ongoing', 'Done']);


	let stagesTasks = [];
	for (let i = 0; i < stagesNames.length; ++i) {
		stagesTasks.push([]);
	}
	for (let task of tasks) {
		const stageId = task.stage;
		stagesTasks[stageId].push(task);
	}

	const [newTask, setNewTask] = React.useState("");

	const onNewTaskChange = (value) => {
		setNewTask(value);

	}

	const onCreateTask = () => {
		if (newTask) {

			setTasks([{
				name: newTask,
				stage: 0
			}, ...tasks])

			setNewTask("");
		}
	}

	const onDeleteTask = (name, stage) => {
		// current Tasks
		const currentTasks = [...tasks];

		// Find Index
		const indexToMove = currentTasks.findIndex((el) => el.name === name && el.stage === stage);

		//Delete && get task
		currentTasks.splice(indexToMove, 1);
		setTasks(currentTasks);

	}

	const onTaskMoveNext = (name, stage) => {
		moveTask(name, stage, +1);
	}
	const onTaskMovePrev = (name, stage) => {
		moveTask(name, stage, -1);
	}

	const moveTask = (name, stage, stageCount) => {

		if ((stage + stageCount) < 0 || (stage + stageCount) > stagesNames.length - 1) return

		// current Tasks
		const currentTasks = [...tasks];

		// Find Index
		const indexToMove = currentTasks.findIndex((el) => el.name === name && el.stage === stage);

		//Delete && get task
		const deletedTask = currentTasks.splice(indexToMove, 1)[0];
		//Change task stage
		deletedTask.stage = stage + stageCount;

		setTasks([...currentTasks, deletedTask]);
	}



	return (
		<div className="mt-20 layout-column justify-content-center align-items-center">
			<section className="mt-50 layout-row align-items-center justify-content-center">
				<input id="create-task-input" type="text" className="large" placeholder="New task name" data-testid="create-task-input" value={newTask} onChange={(e) => { onNewTaskChange(e.target.value) }} />
				<button type="submit" className="ml-30" data-testid="create-task-button" onClick={() => onCreateTask()}>Create task</button>
			</section>

			<div className="mt-50 layout-row">
				{stagesTasks.map((tasks, i) => {
					return (
						<div className="card outlined ml-20 mt-0" key={`${i}`}>
							<div className="card-text">
								<h4>{stagesNames[i]}</h4>
								<ul className="styled mt-50" data-testid={`stage-${i}`}>
									{tasks.map((task, index) => {
										const backCustomAttr = task.stage === 0 ? { disabled: true } : {};
										const forwardCustomAttr = task.stage === stagesNames.length - 1 ? { disabled: true } : {};
										return <li className="slide-up-fade-in" key={`${i}${index}`}>
											<div className="li-content layout-row justify-content-between align-items-center">
												<span data-testid={`${task.name.split(' ').join('-')}-name`}>{task.name}</span>
												<div className="icons">
													<button className='icon-only x-small mx-2' {...backCustomAttr} data-testid={`${task.name.split(' ').join('-')}-back`} onClick={() => onTaskMovePrev(task.name, task.stage)}>
														<i className="material-icons">arrow_back</i>
													</button>
													<button className='icon-only x-small mx-2' {...forwardCustomAttr} data-testid={`${task.name.split(' ').join('-')}-forward`} onClick={() => onTaskMoveNext(task.name, task.stage)}>
														<i className="material-icons">arrow_forward</i>
													</button>
													<button className="icon-only danger x-small mx-2" data-testid={`${task.name.split(' ').join('-')}-delete`} onClick={() => onDeleteTask(task.name, task.stage)}>
														<i className="material-icons">delete</i>
													</button>
												</div>
											</div>
										</li>
									})}
								</ul>
							</div>
						</div>
					)
				})}
			</div>
		</div >
	)
}