import "./globals.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Posts from "./pages/posts/Posts";
import Tasks from "./pages/tasks/Tasks";
import Polls from "./pages/polls/Polls";
import Notes from "./pages/notes/Notes";
import Expenses from "./pages/expenses/Expenses";
import Bookmarks from "./pages/bookmarks/Bookmarks";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Posts />} />
				<Route path="/tasks" element={<Tasks />} />
				<Route path="/polls" element={<Polls />} />
				<Route path="/notes" element={<Notes />} />
				<Route path="/expenses" element={<Expenses />} />
				<Route path="/bookmarks" element={<Bookmarks />} />
			</Routes>
		</Router>
	);
}
