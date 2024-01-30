import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography, MenuItem } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { calcAllFinalGrades } from './utils/calculate_grade';
/**
 * You will find globals from this file useful!
 */
import {} from "./globals";
import { IUniversityClass, IGrade, IStudentFinalGrade} from "./types/api_types";
import { GradeTable } from "./components/GradeTable";

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [finalGrades, setFinalGrades] = useState<IStudentFinalGrade[]>([]);


  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */


  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://spark-se-assessment-api.azurewebsites.net/api/class/listBySemester/spring2023?buid=U59560852", {
          method: "GET",
          headers: {
            "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
          },
        });
        const data: IUniversityClass[] = await response.json();
        setClassList(data);
        //console.log(data)
      } catch (error) {
        console.error("Failed to fetch class list:", error);
      }
      setLoading(false);
    };

    fetchClasses();
  }, []);

  
  const fetchGradesForStudents = async (classId: string, students: string[]) => {
    const gradesPromises = students.map(async (studentId) => {
      const response = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${studentId}/${classId}?buid=U59560852`, {
        method: "GET",
        headers: {
          "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
          "Content-Type": "application/json"
        },
      });
      return response.json();
    });

    const gradesResults = await Promise.all(gradesPromises);
    //console.log(gradesResults.flat())
    setGrades(gradesResults.flat()); 
  };



  useEffect(() => {
    const fetchStudents = async () => {
      if (!currClassId) return;

      setLoading(true);
      try {
        const response = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/class/ListStudents/${currClassId}?buid=U59560852`, {
          method: "GET",
          headers: {
            "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
            "Content-Type": "application/json"
          },
        });
        const studentIds: string[] = await response.json();
        await fetchGradesForStudents(currClassId, studentIds);
      } catch (error) {
        console.error(`Failed to fetch student list for class ${currClassId}:`, error);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [currClassId]);



  const handleClassChange = (event: SelectChangeEvent<string>) => {
    setCurrClassId(event.target.value as string);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
          <Select
              fullWidth={true}
              value={currClassId}
              onChange={handleClassChange}
              displayEmpty
              renderValue={
                currClassId !== "" ? undefined : () => <em>Select a class</em>
              }
              label="Class"
            >
              {classList.map((universityClass) => (
                <MenuItem key={universityClass.classId} value={universityClass.classId}>
                  {universityClass.title}
                </MenuItem>
              ))}
              {/* You'll need to place some code here to generate the list of items in the selection */}
            </Select>
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <div>Place the grade table here</div>
          <GradeTable grades={grades} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;