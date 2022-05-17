using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.EventSystems;
using TMPro;
using System.Runtime.InteropServices;

public class game_scene_controller : MonoBehaviour
{
    [DllImport("__Internal")]
    public static extern void PassNumberParam(float score);
    string[] answerChoice = new string[] { "Rock", "Paper", "Scissors" };
    string question;
    string answer;

    public TMP_Text questionText;
    public TMP_Text answerText;
    public TMP_Text scoreText;
    public TMP_Text hpText;
    public GameObject loseText;
    public GameObject UIBlocker;
    public GameObject rockBut;
    public GameObject paperBut;
    public GameObject scissorsBut;

    public float HP;
    public float score;

    public void Start()
    {
        questionText.GetComponent<TMP_Text>();
        answerText.GetComponent<TMP_Text>();
        scoreText.GetComponent<TMP_Text>();
        hpText.GetComponent<TMP_Text>();
        questionText.text = "";
        answerText.text = "";
        scoreText.text = "score = 0";
        hpText.text = "HP: " + HP.ToString();
        UIBlocker.SetActive(true);
        loseText.SetActive(false);
        rockBut.SetActive(false);
        paperBut.SetActive(false);
        scissorsBut.SetActive(false);
    }

    public void RandomQuestion()
    {
        question = answerChoice[Random.Range(0,3)];
        print(question);
    }

    public void AnswerButton()
    {
        answer = EventSystem.current.currentSelectedGameObject.name;

        if (answer == question)
        {
            print("right");
            if (HP + 10 > 100)
            {
                HP = 100;
            }
            else
            {
                HP += 10;
            }
            score++;
            scoreText.text = "score " + score.ToString();
        }
        else
        {
            print("wrong");
            HP -= 10;
            if (HP <= 0)
            {
                questionText.text = "";
                answerText.text = "";
                hpText.text = "HP: " + HP.ToString();
                UIBlocker.SetActive(true);
                loseText.SetActive(true);
                Invoke("QuitButton", 3f);
                return;
            }
        }

        answerText.text = answer;
        questionText.text = question;
        hpText.text = "HP: " + HP.ToString();
        UIBlocker.SetActive(true);
        Invoke("ShowQuestionAnswer", 0.5f);
    }
    public void ShowQuestionAnswer()
    {
        answerText.text = "";
        questionText.text = "";
        RandomQuestion();
        UIBlocker.SetActive(false);
    }

    public void StartButton()
    {
        Destroy(EventSystem.current.currentSelectedGameObject.gameObject);
        UIBlocker.SetActive(false);
        rockBut.SetActive(true);
        paperBut.SetActive(true);
        scissorsBut.SetActive(true);
        RandomQuestion();
    }

    public void QuitButton()
    {
        PassNumberParam(score);
        SceneManager.LoadScene("menu");
    }
}
