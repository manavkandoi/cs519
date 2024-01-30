/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
interface IAssignmentGrades {
  [assignmentId: string]: number;
}

interface IAssignmentDetails {
  assignmentId: string;
  classId: string;
  date: string;
  weight: number;
}

interface IStudentFinalGrade {
  studentId: string;
  finalGrade: number;
}
/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */
export async function calculateStudentFinalGrade(
  studentId: string,
  classAssignments: IAssignmentDetails[],
  studentGrades: IAssignmentGrades
): Promise<number> {
  let totalWeightedGrades = 0;
  let totalWeights = 0;
  
  classAssignments.forEach(assignment => {
    const grade = studentGrades[assignment.assignmentId];
    if (grade !== undefined) {
      totalWeightedGrades += grade * assignment.weight;
      totalWeights += assignment.weight;
    }
  });

  // The final grade is the sum of weighted grades divided by the sum of weight
  return totalWeights > 0 ? totalWeightedGrades / totalWeights : 0;
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calcAllFinalGrades(classId: string): Promise<IStudentFinalGrade[]> {
  // Fetch the class assignments
  const assignmentsResponse = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/class/listAssignments/${classId}?buid=U595608532`, {
    headers: {
      "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
      "Content-Type": "application/json"
    },
  });
  if (!assignmentsResponse.ok) {
    throw new Error('Failed to fetch class assignments');
  }
  const classAssignments: IAssignmentDetails[] = await assignmentsResponse.json();

  const studentIds = await getStudentIdsForClass(classId); 

  // Calculate final grades for each student
  const finalGradesPromises = studentIds.map(async studentId => {
    // Fetch grades for the student
    const gradesResponse = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${studentId}/${classId}?buid=U59560852`, {
      headers: {
        "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
        "Content-Type": "application/json"
      },
    });
    if (!gradesResponse.ok) {
      throw new Error('Failed to fetch student grades');
    }
    //console.log(studentGrades)
    const studentGrades: IAssignmentGrades = await gradesResponse.json();

    // Calculate final grade for the student
    const finalGrade = await calculateStudentFinalGrade(studentId, classAssignments, studentGrades);
    return {
      studentId,
      finalGrade
    };
  });

  const finalGrades = await Promise.all(finalGradesPromises);
  //console.log(finalGrades)
  return finalGrades;
}

async function getStudentIdsForClass(classId: string): Promise<string[]> {
  const url = `https://spark-se-assessment-api.azurewebsites.net/api/class/ListStudents/${classId}?buid=U59560852`;
  const response = await fetch(url, {
    headers: {
      "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch student IDs');
  }

  const studentIds: string[] = await response.json();
  return studentIds;
}
