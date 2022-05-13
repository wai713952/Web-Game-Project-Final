using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;
using System.Runtime.InteropServices;


public class game_scene : MonoBehaviour
{
    public float score;
    public bool canPop;
    
    [DllImport("__Internal")]
    public static extern void PassNumberParam(float score);
    
    public Image popImage;
    public Sprite normalPic;
    public Sprite popPic;

    public TMP_Text scoreText;

    public GameObject blackPanel;
    public GameObject startButton;
    public GameObject stopButton;
    
    void Start()
    {
        popImage.GetComponent<Image>();
        scoreText.GetComponent<TMP_Text>();
        blackPanel.SetActive(true);
        startButton.SetActive(true);
        stopButton.SetActive(false);
        canPop = true;
    }

    public void PopButton()
    {
        if (canPop)
        {
            score++;
            scoreText.text = "Congratulation: " + score.ToString();
            canPop = false;
            popImage.sprite = popPic;
            Invoke("WaitToPop", 0.05f);
        }
    }
    private void WaitToPop()
    {
        canPop = true;
        popImage.sprite = normalPic;
    }

    public void StartButton()
    {
        blackPanel.SetActive(false);
        startButton.SetActive(false);
        stopButton.SetActive(true);
    }

    public void StopButton()
    {
        blackPanel.SetActive(true);
        startButton.SetActive(true);
        stopButton.SetActive(false);
        PassNumberParam(score);
        //send var to web
        score = 0;  
        scoreText.text = "Congratulation: 0";
    }
    
}