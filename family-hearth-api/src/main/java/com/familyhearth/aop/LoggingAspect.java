package com.familyhearth.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    // --- Pointcut Definitions ---

    /**
     * Pointcut that matches all public methods in the web layer (controllers).
     */
    @Pointcut("within(com.familyhearth..*Controller)")
    public void controllerLayer() {}

    /**
     * Pointcut that matches all public methods in the service layer.
     */
    @Pointcut("within(com.familyhearth..*Service)")
    public void serviceLayer() {}

    /**
     * Pointcut that matches all public methods in the repository layer.
     */
    @Pointcut("within(com.familyhearth..*Repository)")
    public void repositoryLayer() {}


    // --- Advice Definitions ---

    /**
     * Advice that logs when a method in the web layer is entered.
     */
    @Before("controllerLayer()")
    public void logBeforeController(JoinPoint joinPoint) {
        log.info("==================== API Request Start ====================");
        log.info("==> CONTROLLER: {}.{}() with arguments = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs()));
    }

    /**
     * Advice that logs when a method in the service layer is entered.
     */
    @Before("serviceLayer()")
    public void logBeforeService(JoinPoint joinPoint) {
        log.info("  -> SERVICE   : {}.{}()",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName());
    }

    /**
     * Advice that logs when a method in the repository layer is entered.
     */
    @Before("repositoryLayer()")
    public void logBeforeRepository(JoinPoint joinPoint) {
        log.info("    ~> DATABASE: {}.{}()",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName());
    }

    /**
     * Advice that logs when a method in the web layer returns successfully.
     */
    @AfterReturning(pointcut = "controllerLayer()", returning = "result")
    public void logAfterController(JoinPoint joinPoint, Object result) {
        log.info("<== CONTROLLER: {}.{}() returned with value = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                result);
        log.info("==================== API Request End ======================");
    }

    /**
     * Advice that logs when an exception is thrown from any of the layers.
     */
    @AfterThrowing(pointcut = "controllerLayer() || serviceLayer() || repositoryLayer()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("!!! EXCEPTION in {}.{}() with cause = '{}' and exception = '{}'",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                e.getCause() != null ? e.getCause() : "NULL",
                e.getMessage());
        log.error("==================== API Request Failed ====================");
    }
}
